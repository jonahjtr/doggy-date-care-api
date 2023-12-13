const db = require("../config/db");
const pool = require("../config/db");
module.exports = {
  getAllDogs: async function (userEmail) {
    try {
      const query = `
      SELECT * FROM dogs
      WHERE user_email = $1;
    `;
      const values = [userEmail];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving dogs for user:", error);
      throw error;
    }
  },
  getDog: async function (dogId) {
    try {
      const query = `
      SELECT *  FROM dogs
      WHERE id = $1;
    `;

      const values = [dogId];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null; // No dog found with the specified ID
      }
    } catch (error) {
      console.error("Error retrieving dog by ID:", error);
      throw error;
    }
  },
  getDogOwner: async function (dogId) {
    try {
      const query = `
      SELECT user_email  FROM dogs
      WHERE id = $1;
    `;

      const values = [dogId];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null; // No dog found with the specified ID
      }
    } catch (error) {
      console.error("Error retrieving dog by ID:", error);
      throw error;
    }
  },

  create: async function (ownerEmail, data) {
    if (!data.profile_picture || data.profile_picture === "undefined")
      data.profile_picture = "null";
    try {
      const query = `INSERT INTO dogs (user_email, name, date_of_birth, age,sex, breed, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`;
      const values = [
        ownerEmail,
        data.name,
        data.date_of_birth,
        data.age,
        data.sex,
        data.breed,
        data.profile_picture,
      ];
      const result = await pool.query(query, values);
      if (!result) {
        console.log("error with query");
        return;
      } else {
        return result.rows[0];
      }
    } catch (error) {
      console.log("Error creating dog", error);
    }
  },
  update: async function (id, updateData) {
    try {
      const columnsToUpdate = Object.keys(updateData);

      if (columnsToUpdate.length === 0) {
        throw new Error("No columns to update provided");
      }

      const values = [id, ...Object.values(updateData)];

      const setClause = columnsToUpdate
        .map((column, index) => `${column} = $${index + 2}`)
        .join(", ");

      const query = `
      UPDATE dogs
      SET ${setClause}
      WHERE id = $1
      RETURNING *;
    `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`Record with ID ${id} not found`);
      }
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating record:", error);
      throw error;
    }
  },
  delete: async function (dogID, ownerEmail) {
    //will go through two middlewares to verify token and also to verify dog owner
    // delete dog by id, and return success: true

    try {
      const result = await db.query(
        "DELETE FROM dogs WHERE id = $1 RETURNING *",
        [dogID]
      );
      if (result.rows.length === 0) {
        throw new Error(`error with deleting dog profile`);
      }
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
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
  createMedicines: async function (medicinesData) {
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
};
