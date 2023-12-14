const db = require("../config/db");
const pool = require("../config/db");
module.exports = {
  getUserAndDogs: async function (email) {
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
  json_agg(
    CASE WHEN dogs.id IS NOT NULL THEN
      json_build_object(
        'dog_id', dogs.id,
        'dog_name', dogs.name,
        'dog_date_of_birth', dogs.date_of_birth,
        'dog_age', dogs.age,
        'dog_sex', dogs.sex,
        'dog_breed', dogs.breed,
        'dog_profile_picture', dogs.profile_picture,
        'medicines', (
          SELECT
            json_agg(
              json_build_object(
                'medicine_id', medicines.id,
                'medicine_name', medicines.name,
                'medicine_dosage', medicines.dosage,
                'medicine_frequency', medicines.frequency,
                'medicine_start_date', medicines.start_date,
                'medicine_end_date', medicines.end_date,
                'medicine_instructions', medicines.instructions,
                'medicine_description', medicines.description
              )
            )
          FROM
            medicines
          WHERE
            medicines.dog_id = dogs.id
        )
      )
    ELSE
      null
    END
  ) AS dogs
FROM
  users
LEFT JOIN
  dogs ON users.email = dogs.user_email
WHERE
  users.email = $1
GROUP BY
  users.id, users.username, users.email, users.first_name, users.last_name,
  users.date_of_birth, users.phone_number, users.state, users.city;
    `,
        [email]
      );

      return result.rows.map((row) => {
        // Remove null values from the 'dogs' array
        row.dogs = row.dogs.filter((dog) => dog !== null);
        if (row.dogs.length == 0) delete row.dogs;

        return row;
      });
    } catch (error) {
      console.error("Error retrieving user and dogs:", error);
      throw error;
    }
  },
};
