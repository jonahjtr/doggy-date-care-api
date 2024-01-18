const db = require("../config/db");
const pool = require("../config/db");
const { DatabaseError } = require("../utils/errorHandlers/DataBaseErrors");

module.exports = {
  getAllDogs: async function (user_id) {
    try {
      const query = `
      SELECT * FROM dogs
      WHERE user_id = $1;
    `;
      const values = [user_id];
      const result = await pool.query(query, values);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getDog: async function (dogId) {
    try {
      const query = `
SELECT
  dogs.id AS dog_id,
  dogs.name AS dog_name,
  dogs.date_of_birth AS dog_date_of_birth,
  dogs.age AS dog_age,
  dogs.sex AS dog_sex,
  dogs.profile_picture AS dog_profile_picture,
  json_build_object(
    'breed_id', breed.breed_id,
    'breed_name', breed.breed_name,
    'size', breed.size,
    'characteristics', breed.characteristics,
    'temperament', breed.temperament,
    'exercise_needs', breed.exercise_needs,
    'health_issues_and_lifespan', breed.health_issues_and_lifespan,
    'grooming_needs', breed.grooming_needs,
    'training_info', breed.training_info,
    'diet_and_nutrition', breed.diet_and_nutrition,
    'history', breed.history,
    'lifestyle_compatibility', breed.lifestyle_compatibility,
    'rescue_and_adoption_resources', breed.rescue_and_adoption_resources,
    'average_height', breed.average_height,
    'average_weight', breed.average_weight
  ) AS breed_info,
  json_agg(
    json_build_object(
      'id', medicines.id,
      'name', medicines.name,
      'dosage', medicines.dosage,
      'frequency', medicines.frequency,
      'start_date', medicines.start_date,
      'end_date', medicines.end_date,
      'instructions', medicines.instructions,
      'description', medicines.description
    )
  ) AS medicines
FROM
  dogs
LEFT JOIN
  medicines ON dogs.id = medicines.dog_id
LEFT JOIN
  breed ON dogs.breed_id = breed.breed_id
WHERE
  dogs.id = $1 
GROUP BY
  dogs.id, dog_name, dog_date_of_birth, dog_age, dog_sex, dog_profile_picture, breed.breed_id;
    `;

      const values = [dogId];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) return [];
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  create: async function (ownerId, data) {
    try {
      const query = `INSERT INTO dogs (user_id, name, date_of_birth,sex, breed) VALUES ($1, $2, $3, $4, $5) returning *`;
      const values = [
        ownerId,
        data.name,
        data.date_of_birth,
        data.sex,
        data.breed,
      ];
      const result = await pool.query(query, values);
      if (!result) {
        const error = new Error("Problem creating dog");
        error.status = 500;
        throw error;
      }
      if (!result.rows || result.rows.length === 0) {
        const error = new Error("No dog found for this user");
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  update: async function (id, updateData) {
    try {
      const columnsToUpdate = Object.keys(updateData);

      if (columnsToUpdate.length === 0) {
        const error = new Error("No columns to update provided");
        error.status = 404;
        throw error;
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
      if (!result) {
        const error = new Error("Problem Updating dog");
        error.status = 500;
        throw error;
      }
      if (!result.rows || result.rows.length === 0) {
        const error = new Error("No dog found for this user");
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  delete: async function (dogID) {
    try {
      const result = await db.query(
        "DELETE FROM dogs WHERE id = $1 RETURNING *",
        [dogID]
      );
      if (!result) {
        const error = new Error("Problem Deleting dog");
        error.status = 500;
        throw error;
      }
      if (!result.rows || result.rows.length === 0) {
        const error = new Error("No dog found for this user");
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};
