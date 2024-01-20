const pool = require("../config/db");

module.exports = {
  getMedicines: async function (dogId) {
    try {
      const query = "SELECT * FROM medicines WHERE dog_id = $1";
      const values = [dogId];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getMedicinesByUserId: async function (userId) {
    try {
      const query = "SELECT * FROM medicines WHERE user_id = $1";
      const values = [userId];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  create: async function (medicineData, dogId) {
    try {
      const {
        medicine_name,
        medicine_start_date,
        medicine_end_date,
        medicine_dosage,
        medicine_instructions,
        medicine_frequency,
        description,
      } = medicineData;

      const query = `
      INSERT INTO medicines (name, start_date, end_date, dosage, instructions, frequency, description, dog_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

      const values = [
        medicine_name,
        medicine_start_date,
        medicine_end_date,
        medicine_dosage,
        medicine_instructions,
        medicine_frequency,
        description,
        dogId,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        const error = new Error("Medicine not created");
        error.status = 404;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },

  edit: async function (medicineId, updateData) {
    try {
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

      if (updates.length === 0) {
        const error = new Error("No valid columns to update provided");
        error.status = 404;
        throw error;
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
        const error = new Error(`Medicine with ID ${medicineId} not found`);
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getMedicineIdsByDogId: async function (dogId) {
    try {
      const query = "SELECT id FROM medicines WHERE dog_id = $1";
      const values = [dogId];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) return [];
      return result.rows.map((row) => row.id);
    } catch (error) {
      throw error;
    }
  },
  deleteMedicine: async function (medicineId) {
    try {
      const query = "DELETE FROM medicines WHERE id = $1 RETURNING *;";
      const values = [medicineId];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        const error = new Error(`Medicine with ID ${medicineId} not found`);
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};
