const pool = require("../config/db");

module.exports = {
  getDates: async function (dogId) {
    try {
      const query = "SELECT * FROM dates WHERE dog_id = $1";
      const values = [dogId];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving dates:", error);
      throw error;
    }
  },
  create: async function (dateData, dogId) {
    try {
      const {
        date_id,
        user_id,
        dog_id,
        start_date_time,
        end_date_time,
        location,
        description,
      } = dateData;

      const query = `
      INSERT INTO Dates (date_id, user_id, dog_id, start_date_time, end_date_time, location, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

      const values = [
        date_id,
        user_id,
        dog_id,
        start_date_time,
        end_date_time,
        location,
        description,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0]; // Assuming you want to return the created medicine
      } else {
        throw new Error("Medicine creation failed");
      }
    } catch (error) {
      console.error("Error creating medicine:", error);
      throw error;
    }
  },

  edit: async function (medicineId, updateData) {
    console.log("Keys in updateData:", Object.keys(updateData));

    try {
      console.log("update data", updateData);

      // Define your list of valid columns to update
      const VALID_COLUMNS = [
        "name",
        "dosage",
        "frequency",
        "start_date",
        "end_date",
        "instructions",
        "description",
      ];

      const updates = Object.entries(updateData).filter(([key]) =>
        VALID_COLUMNS.includes(key)
      );

      console.log(updates);

      if (updates.length === 0) {
        throw new Error("No valid columns to update provided");
      }

      // Build query
      const setClause = updates
        .map(([key], index) => `${key} = $${index + 2}`)
        .join(", ");

      const values = [medicineId, ...updates.map(([, value]) => value)];

      const query = `
      UPDATE medicines
      SET ${setClause}
      WHERE id = $1
      RETURNING *;
    `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`Medicine with ID ${medicineId} not found`);
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error;
    }
  },

  getMedicineIdsByDogId: async function (dogId) {
    try {
      const query = "SELECT id FROM medicines WHERE dog_id = $1";
      const values = [dogId];

      const result = await pool.query(query, values);
      return result.rows.map((row) => row.id);
    } catch (error) {
      console.error("Error retrieving medicine IDs:", error);
      throw error;
    }
  },
  deleteMedicine: async function (medicineId) {
    try {
      const query = "DELETE FROM medicines WHERE id = $1 RETURNING *;";
      const values = [medicineId];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`Medicine with ID ${medicineId} not found`);
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  },
};
