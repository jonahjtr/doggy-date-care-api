const db = require("../config/db");
const pool = require("../config/db");
const sharp = require("sharp");

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
  getAllPhotosForUser: async function (user_id) {
    console.log("working");
    try {
      const query = `
      SELECT * FROM photos
      WHERE user_id = $1;
    `;
      const values = [user_id];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) return null;
      const photoList = result.rows;
      //gets all images from result of photo query by dog id
      for (let photo of photoList) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: photo.photo_name,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        photo.photo_url = url;
      }
      return result.rows;
    } catch (error) {
      console.error("Error retrieving photos for user:", error);
      throw error;
    }
  },
  getSpecificPhoto: async function (photo_name) {
    try {
      const query = `
      SELECT * FROM photos
      WHERE photo_name = $1;
    `;
      const values = [photo_name];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) return null;
      return result.rows;
    } catch (error) {
      console.error("Error retrieving photos for user:", error);
      throw error;
    }
  },
  getAllPhotosFordog: async function (dog_id) {
    try {
      const query = `
      SELECT * FROM photos
      WHERE dog_id = $1;
    `;
      const values = [dog_id];
      const result = await pool.query(query, values);

      const photoList = result.rows;
      //gets all images from result of photo query by dog id
      for (let photo of photoList) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: photo.photo_name,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        photo.photo_url = url;
      }

      return result.rows;
    } catch (error) {
      console.error("Error retrieving photos for user:", error);
      throw error;
    }
  },
  postPhoto: async function (name) {
    try {
      const query = `
      SELECT * FROM photos
      WHERE name = $1;
    `;
      const values = [name];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) return null;
      return result.rows;
    } catch (error) {
      console.error("Error retrieving photos for user:", error);
      throw error;
    }
  },
  getPhotoFromS3: async function (photo_name) {
    try {
      const getObjectParams = {
        Bucket: bucketName,
        Key: photo_name,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.log("error retreiving photo url");
      throw error;
    }
  },
  postPhotoToS3: async function (photoName, data) {
    const buffer = await sharp(data.buffer)
      .resize({ height: 600, width: 600, fit: "contain" })
      .toBuffer();
    try {
      const params = {
        Bucket: bucketName,
        Key: photoName,
        Body: buffer,
        ContentType: data.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      return;
    } catch (error) {
      console.error("Error uploading photo for user:", error);
      throw error;
    }
  },
  deletePhotoFromS3: async function (photoName) {
    try {
      const params = {
        Bucket: bucketName,
        Key: photoName,
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);

      return;
    } catch (error) {
      console.error("Error uploading photo for user:", error);
      throw error;
    }
  },
  postPhotoToDB: async function (name, user_id, dog_id) {
    try {
      const query = `
      INSERT INTO photos (photo_name,  user_id, dog_id)
      VALUES ($1,$2,$3)
      RETURNING photo_name;

    `;
      const values = [name, user_id, dog_id];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) {
        console.log("error uploading photo");
        throw error;
      } else {
        return result.rows[0];
      }
    } catch (error) {
      console.error("Error uploading photo for user:", error);
      throw error;
    }
  },
  updateProfilePhotoInDB: async function (name, dogId) {
    console.log("name", name);
    try {
      const query = `
      UPDATE dogs
      SET profile_picture = $1
      WHERE id = $2
      RETURNING profile_picture;
    `;
      const values = [name, dogId];
      const result = await pool.query(query, values);

      if (result.rows.length < 1) {
        console.log("Error updating profile photo");
        throw new Error("No rows were updated.");
      } else {
        return result.rows[0].profile_picture;
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw error;
    }
  },

  deletePhotoFromDB: async function (photoName) {
    try {
      const query = "DELETE FROM photos WHERE photo_name = $1 RETURNING *;";
      const values = [photoName];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) {
        console.log("error deleting photo in query");
        throw error;
      } else {
        return result.rows[0];
      }
    } catch (error) {
      console.error("Error deleting photo for user:", error);
      throw error;
    }
  },
};
