const db = require("../config/db");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const Dog = require("../models/dogModels");

module.exports = {
  create: async function (req, res) {
    const data = req.body;
    try {
      await validateUserData(data);

      const { username, email, password, first_name, last_name } = data;

      const hashedPassword = await hashPassword(password);
      const query =
        "INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const values = [username, email, hashedPassword, first_name, last_name];

      const result = await pool.query(query, values);
      console.log("logging result inside create", result.rows[0]);
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return "username already exists";
      }
    } catch (error) {
      if (error.code === "23505") {
        throw { status: 400, error: error.detail }; // Throw an error object with status and error message
      }
      console.error("Error:", error);
      throw error;
    }
  },
  verifyUser: async function (email, password) {
    try {
      const data = { email: email, password: password };
      await validateUserData(data);

      const user = await findUserByEmail(email);

      if (user === "No user found") {
        return { status: 404, error: "User not found" };
      }

      let hasDogs;
      try {
        const dogs = await Dog.getAllDogs(user.id);
        hasDogs = Array.isArray(dogs) && dogs.length > 0;
      } catch (dogError) {
        console.error("Error retrieving dogs:", dogError);
        return { status: 500, error: "Error retrieving dogs" };
      }

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
          },
          process.env.SECRET_KEY_JWT,
          { expiresIn: "7d" }
        );

        const refreshToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
          },
          process.env.SECRET_KEY_JWT,
          { expiresIn: "7d" }
        );

        console.log("do they have dogs? ", hasDogs);

        return {
          status: 200,
          data: {
            message: "Login successful",
            token,
            refreshToken,
            hasDogs: hasDogs,
          },
        };
      } else {
        return { status: 401, error: "Incorrect password" };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, error: "Internal Server Error" };
    }
  },

  delete: async function (data) {
    try {
      const user = await findUserByEmail(data.email);

      if (!user) {
        return { success: false, error: "User not found" };
      } else {
        const query = "DELETE FROM users WHERE id = $1";
        const result = await pool.query(query, [data.id]);

        if (result.rowCount > 0) {
          return { success: true };
        } else {
          return { success: false, error: "User not deleted" };
        }
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      return { success: false, error: "Internal Server Error" };
    }
  },
  findOneByEmail: async function (email) {
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
  },
  getDogOwnerId: async function (dogId) {
    try {
      const query = `
      SELECT user_id  FROM dogs
      WHERE id = $1;
    `;

      const values = [dogId];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0].user_id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error retrieving dog by ID:", error);
      throw error;
    }
  },
  getPhotoOwnerId: async function (photoName) {
    try {
      const query = `
      SELECT user_id  FROM photos
      WHERE photo_name = $1;
    `;

      const values = [photoName];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0].user_id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error retrieving photo by name:", error);
      throw error;
    }
  },
  getFileOwnerId: async function (file_name) {
    try {
      const query = `
      SELECT user_id  FROM files
      WHERE file_name = $1;
    `;

      const values = [file_name];
      const result = await pool.query(query, values);
      if (result.rows[0].user_id) {
        return result.rows[0].user_id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error retrieving file by name:", error);
      throw error;
    }
  },
};

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
async function checkUsernameAvailability(username) {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows[0]) {
      //returns all info on user

      return result.rows[0];
    } else {
      return "No user found";
    }
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
async function findUserByEmail(email) {
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
