const Promise = require("promise");
const db = require("../config/database");
const bcrypt = require("bcrypt");

module.exports = {
  // READ
  findAll: async function () {
    try {
      const results = await db.query("SELECT * FROM users ORDER BY id ASC", []);
      return results.rows;
    } catch (error) {
      throw error;
    }
  },

  findOne: async function (data) {
    try {
      if (!data.id && !data.email) {
        throw new Error("Error: must provide id or email");
      }

      let results;
      if (data.id) {
        results = await findOneById(data.id);
      } else {
        results = await findOneByEmail(data.email);
      }

      // If you want to remove the password from the results, uncomment the following line *** dont for get in prod
      // delete results.password;

      return results;
    } catch (err) {
      throw err;
    }
  },

  getUserByUserEmail: async function (data) {
    try {
      const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
        data.email,
      ]);

      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return "No user found with the provided email";
      }
    } catch (err) {
      throw err;
    }
  },

  // CREATE
  create: async function (data) {
    try {
      await validateUserData(data);

      const hashedPassword = await hashPassword(data.password);

      // const emailExists = await doesEmailExist(data.email);
      // if (emailExists) {
      //   throw new Error("Email already exists");
      // }

      const result = await db.query(
        "INSERT INTO users (name, email, age, dob, password) VALUES ($1, $2, $3, $4, $5) returning id",
        [data.name, data.email, data.age, data.dob, hashedPassword]
      );
      if (result.rows[0].id) {
        return result.rows[0].id;
      } else {
        throw new Error("User creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  // UPDATE

  update: async function (data) {
    try {
      const result = await db.query(
        `
      UPDATE users
      SET name = $1, email = $2, age = $3
      WHERE id = $4
      RETURNING *;
    `,
        [data.name, data.email, data.age, data.id]
      );

      if (result.rows[0]) {
        return result.rows[0];
      } else {
        throw new Error("No user found to update");
      }
    } catch (err) {
      throw err;
    }
  },

  // DELETE
  delete: async function (data) {
    try {
      const result = await db.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [data.id]
      );

      if (result.rows[0]) {
        return result.rows[0];
      } else {
        throw "No user found to delete";
      }
    } catch (err) {
      throw err;
    }
  },
};

async function doesEmailExist(email) {
  const query = "SELECT COUNT(*) AS count FROM users WHERE email = $1";
  const values = [email];

  try {
    const result = await db.query(query, values);
    const count = parseInt(result.rows[0].count, 10);
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
}
async function findOneById(id) {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows[0]) {
      return result.rows[0];
    } else {
      return "No user found";
    }
  } catch (err) {
    throw err;
  }
}

async function findOneByEmail(email) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows[0]) {
      //returns all info on user
      return result.rows[0];
    } else {
      return "No user found";
    }
  } catch (err) {
    console.error("Error finding user by email:", err);
    throw err;
  }
}

async function validateUserData(data) {
  try {
    if (!data.password || !data.email) {
      return "email and/or password missing";
    }

    await validatePassword(data.password, 6);
    await validateEmail(data.email);

    return;
  } catch (err) {
    throw err;
  }
}

async function validateEmail(email) {
  try {
    if (typeof email !== "string") {
      throw "email must be a string";
    }

    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (emailRegex.test(email)) {
      return;
    } else {
      throw "Provided email does not match proper email format";
    }
  } catch (err) {
    console.error("Email validation error:", err);
  }
}

async function validatePassword(password, minCharacters) {
  try {
    if (typeof password !== "string") {
      throw "password must be a string";
    } else if (password.length < minCharacters) {
      throw `password must be at least ${minCharacters} characters long`;
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
}

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (err) {
    throw err;
  }
}
