const pool = require("../config/db");

module.exports = {
  getDatesByDogId: async function (dogId) {
    try {
      const query = "SELECT * FROM dates WHERE dog_id = $1";
      const values = [dogId];

      const result = await pool.query(query, values);
      if (!results) {
        const error = new Error("Problem getting dates for dog.");
      }
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getDatesByUser: async function (userId) {
    console.log("dog id here: ", userId);

    try {
      const query = `SELECT Dates.*, Dogs.name 
FROM Dates 
JOIN Dogs ON Dates.dog_id = Dogs.id 
WHERE Dates.user_id = $1;`;
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving dates:", error);
      throw error;
    }
  },
  createByDogAndUserId: async function (dateData, userId, dogId) {
    try {
      const { start_date_time, end_date_time, location, description, title } =
        dateData;

      const query = `
      INSERT INTO Dates ( user_id, dog_id, start_date_time, end_date_time, location, description, title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
      const values = [
        userId,
        dogId,
        start_date_time,
        end_date_time,
        location,
        description,
        title,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error("Medicine creation failed");
      }
    } catch (error) {
      console.error("Error creating medicine:", error);
      throw error;
    }
  },
};
