const pool = require("../config/db");

module.exports = {
  getDatesByDogId: async function (dogId) {
    try {
      const query = "SELECT * FROM dates WHERE dog_id = $1";
      const values = [dogId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getDatesByUser: async function (userId) {
    try {
      const query = `SELECT Dates.*, Dogs.name 
FROM Dates 
JOIN Dogs ON Dates.dog_id = Dogs.id 
WHERE Dates.user_id = $1;`;
      const values = [userId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  editDate: async function (updateData, date_id) {
    try {
      const VALID_COLUMNS = [
        "start_date_time",
        "end_date_time",
        "location",
        "location",
        "description",
        "title",
      ];
      const updates = Object.entries(updateData).filter(([key]) =>
        VALID_COLUMNS.includes(key)
      );
      if (updates.length === 0) {
        const error = new Error("No valid columns to update provided");
        error.status = 404;
        throw error;
      }
      // Build query
      const setClause = updates
        .map(([key], index) => `${key} = $${index + 2}`)
        .join(", ");
      const values = [date_id, ...updates.map(([, value]) => value)];
      const query = `
      UPDATE Dates
      SET ${setClause}
      WHERE date_id = $1
      RETURNING *;
    `;
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        const error = new Error(`date with ID ${date_id} not found`);
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
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
        const error = new Error("date creation failed");
        error.status = 500;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },
  deleteDate: async function (date_id) {
    try {
      const query = "DELETE FROM dates WHERE date_id = $1 RETURNING *";
      const values = [date_id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        const error = new Error(`date with ID ${date_id} not found`);
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  deleteAllDates: async function (dog_id) {
    try {
      const query = "DELETE FROM dates WHERE dog_id = $1 RETURNING *";
      const values = [dog_id];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};
