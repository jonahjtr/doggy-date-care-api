const pool = require("../config/db");
const VALID_COLUMNS = [
  "name",
  "dosage",
  "frequency",
  "start_date",
  "end_date",
  "instructions",
  "description",
];

module.exports = {
  getMedicines: async function (dogId) {
    try {
      const query = "SELECT * FROM medicines WHERE dog_id = $1";
      const values = [dogId];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving medicines:", error);
      throw error;
    }
  },
  create: async function (medicinesData) {
    try {
      const values = medicinesData.map((medicineData) => {
        const { dogId, name, dosage, description } = medicineData;
        return [dogId, name, dosage, description];
      });

      const query = `
        INSERT INTO medicines (dog_id, name, dosage, description)
        VALUES ${values
          .map(
            (_, index) =>
              `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
                index * 4 + 4
              })`
          )
          .join(",")}
        RETURNING *;
      `;

      const flatValues = values.flat();
      const result = await pool.query(query, flatValues);

      if (result.rows.length > 0) {
        return result.rows;
      } else {
        throw new Error("Medicine creation failed");
      }
    } catch (error) {
      console.error("Error creating medicines:", error);
      throw error;
    }
  },
  edit: async function (medicineId, updateData) {
    try {
      const updates = Object.entries(updateData).filter(([key]) =>
        VALID_COLUMNS.includes(key)
      );

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
