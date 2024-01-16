const pool = require("../config/db");
const { DatabaseError } = require("../utils/errorHandlers/DataBaseErrors");

const { GetSignedUrl, getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

module.exports = {
  getUserInfo: async function (userId) {
    try {
      const result = await pool.query(
        `
SELECT
  users.id AS user_id,
  users.username,
  users.email AS user_email,
  users.first_name,
  users.last_name,
  users.date_of_birth,
  users.phone_number,
  users.state,
  users.city,
  COALESCE(dogs.dogs, '[]'::json) AS dogs,
  COALESCE(date_events.date_events, '[]'::json) AS date_events
FROM users
LEFT JOIN (
  SELECT
    user_id,
    json_agg(
      json_build_object(
        'dog_id', id,
        'dog_name', name,
        'dog_profile_picture', profile_picture
      )
    ) AS dogs
  FROM dogs
  GROUP BY user_id
) AS dogs ON users.id = dogs.user_id
LEFT JOIN (
  SELECT
    dates.user_id,
    json_agg(
      json_build_object(
        'id', dates.date_id,
        'dog_id', dates.dog_id,
        'dog_name', dogs.name, 
        'title', dates.title,
        'description', dates.description,
        'start_date_time', dates.start_date_time,
        'end_date_time', dates.end_date_time
      )
    ) AS date_events
  FROM dates
  JOIN dogs ON dates.dog_id = dogs.id -- Join with the Dogs table
  GROUP BY dates.user_id
) AS date_events ON users.id = date_events.user_id
WHERE users.id = $1;

    `,
        [userId]
      );

      if (result.rows.length === 0) {
        // Handle the "Not Found" error (no user info found)
        throw new DatabaseError("No user info found", 404);
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError && error.status === 404) {
        // Handle the "Not Found" error (no user info found)
        console.error(`${error.name}: ${error.message}`);
        // Send a 404 response or take appropriate action
      } else {
        // Handle other types of errors (e.g., internal server errors)
        console.error("Error retrieving user info:", error);
        // Send a 500 response or take appropriate action
      }
    }
  },
};
