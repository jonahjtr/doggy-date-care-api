const pool = require("../config/db");

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
      if (!result) {
        const error = new Error("Problem with database finding user by id");
        error.status = 500;
        throw error;
      }
      if (result.rows.length === 0) {
        const error = new Error("No User Found by that ID");
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};
