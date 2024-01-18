const db = require("../config/db");
const pool = require("../config/db");
const moment = require("moment");
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
  getAllFilesForUser: async function (user_id) {
    try {
      const query = `
      SELECT * FROM files
      WHERE user_id = $1;
    `;
      const values = [user_id];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) return null;
      return result.rows;
    } catch (error) {
      console.error("Error retrieving files for user:", error);
      throw error;
    }
  },
  getSpecificFile: async function (file_name) {
    try {
      const query = `
      SELECT * FROM files
      WHERE file_name = $1;
    `;
      const values = [file_name];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) return null;
      return result.rows;
    } catch (error) {
      console.error("Error retrieving file for user:", error);
      throw error;
    }
  },
  getAllFilesFordog: async function (dog_id) {
    try {
      const query = `
      SELECT * FROM files
      WHERE dog_id = $1;
    `;
      const values = [dog_id];
      const result = await pool.query(query, values);
      if (!result) {
        const error = new Error("Problem getting files for dog.");
      }
      if (result.rows.length < 1) return [];

      const fileList = result.rows;
      for (let file of fileList) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: file.file_name,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        file.file_url = url;
      }

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getFileFromS3: async function (file_name) {
    try {
      const getObjectParams = {
        Bucket: bucketName,
        Key: file_name,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.log("error retreiving file url");
      throw error;
    }
  },
  postFileToS3: async function (file_name, data) {
    try {
      const params = {
        Bucket: bucketName,
        Key: file_name,
        Body: data.buffer,
        ContentType: data.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      return;
    } catch (error) {
      console.error("Error uploading file for user:", error);
      throw error;
    }
  },
  deleteFileFromS3: async function (file_name) {
    try {
      const params = {
        Bucket: bucketName,
        Key: file_name,
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);

      return;
    } catch (error) {
      console.error("Error deleting file for user:", error);
      throw error;
    }
  },
  postFileToDB: async function (name, file_nickname, user_id, dog_id) {
    const currentDate = moment().format("MMM Do YY");

    try {
      const query = `
      INSERT INTO files (file_name,file_nickname, user_id, dog_id, upload_date)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING file_nickname;
    `;
      const values = [name, file_nickname, user_id, dog_id, currentDate];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) {
        console.log("error uploading file");
        throw error;
      } else {
        return result.rows[0];
      }
    } catch (error) {
      console.error("Error uploading file for user:", error);
      throw error;
    }
  },
  deleteFileFromDB: async function (file_name) {
    try {
      const query = "DELETE FROM files WHERE file_name = $1 RETURNING *;";
      const values = [file_name];
      const result = await pool.query(query, values);
      if (result.rows.length < 1) {
        console.log("error deleting file in query");
        throw error;
      } else {
        return result.rows[0];
      }
    } catch (error) {
      console.error("Error deleting file for user:", error);
      throw error;
    }
  },
};
