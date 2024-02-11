const db = require("../config/db");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const Dog = require("../models/dogModels");

module.exports = {
  create: async function (data) {
    try {
      await validateUserData(data);

      const { username, email, password, first_name, last_name } = data;
      const hashedPassword = await hashPassword(password);
      const query =
        "INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING username, email, first_name, last_name";

      const values = [username, email, hashedPassword, first_name, last_name];
      const result = await pool.query(query, values);

      if (result.rows.length === 1) {
        // Check if exactly one row was returned
        return result.rows[0];
      } else {
        const error = new Error("User creation failed");
        error.status = 500;
        throw error;
      }
    } catch (error) {
      if (error.code === "23505") {
        const uniqueConstraintError = new Error(
          "User with this email or username already exists"
        );
        uniqueConstraintError.status = 400;

        throw uniqueConstraintError;
      }
      throw error;
    }
  },

  verifyUser: async function (email, password) {
    try {
      const data = { email: email, password: password };
      await validateUserData(data);
      const user = await findUserByEmail(email);

      if (user.length === 0) {
        const error = new Error("User Not found");
        error.status = 404;
        throw error;
      }
      let hasDogs; // this checks if the user has any dogs
      try {
        const dogs = await Dog.getAllDogs(user.id);
        hasDogs = Array.isArray(dogs) && dogs.length > 0;
      } catch (error) {
        console.error("Error retrieving dogs:", dogError);
        throw error;
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
        const error = new Error("Incorrect Password");
        error.status = 401;
        throw error;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  delete: async function (data) {
    try {
      const user = await findUserByEmail(data.email);

      if (!user) {
        const error = new Error("error finding user to delete");
        error.status = 404;
        throw error;
      } else {
        const query = "DELETE FROM users WHERE id = $1";
        const result = await pool.query(query, [data.id]);

        if (result.rowCount > 0) {
          return { success: true };
        } else {
          const error = new Error("Error deleting user");
          error.status = 500;
          throw error;
        }
      }
    } catch (error) {
      console.error("Error deleting user:", err);
      throw error;
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
        const error = new Error("could Not find user by email");
        error.status = 404;
        throw error;
      }
    } catch (error) {
      console.error("Error finding user by email:", err);
      throw error;
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
      if (result.rows.length === 0) {
        const error = new Error("Could not find dog");
        error.status = 404;
        throw error;
      }
      if (result.rows.length > 0) {
        return result.rows[0].user_id;
      } else {
        const error = new Error("Could Not find owner connected to dog");
        error.status = 404;
        throw error;
      }
    } catch (error) {
      console.error("Error retrieving dogs owner id:", error);
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
      if (result.rows.length === 0) {
        const error = new Error("Could not find photo");
        error.status = 404;
        throw error;
      }
      if (result.rows.length > 0) {
        return result.rows[0].user_id;
      } else {
        const error = new Error("Could Not find owner connected to photo");
        error.status = 404;
        throw error;
      }
    } catch (error) {
      console.error("Error retrieving photo owner id:", error);
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
      if (result.rows.length === 0) {
        const error = new Error("Could not find file");
        error.status = 404;
        throw error;
      }
      if (result.rows[0].user_id) {
        return result.rows[0].user_id;
      } else {
        const error = new Error("Could not find file owner id");
        error.status = 404;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },
};

async function validateUserData(data) {
  try {
    if (!data.email || !data.password) {
      const error = new Error("missing email or password");
      error.status = 400;
      throw error;
    }
    await validatePassword(data.password, 6);
    await validateEmail(data.email);
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
  } catch (error) {
    throw error;
  }
}
async function validateEmail(email) {
  try {
    if (typeof email !== "string") {
      const error = new Error("email must be a string");
      error.status = 400;
      throw error;
    }

    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (emailRegex.test(email)) {
      return;
    } else {
      const error = new Error("email in incorrect format");
      error.status = 400;
      throw error;
    }
  } catch (error) {
    console.error("Email validation error:", err);
    throw error;
  }
}

async function validatePassword(password, minCharacters) {
  try {
    if (typeof password !== "string") {
      const error = new Error("password must be a string");
      error.status = 400;
      throw error;
    } else if (password.length < minCharacters) {
      const error = new Error(
        `password must be at least ${minCharacters} characters long`
      );
      error.status = 400;
      throw error;
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
}

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    const error = new Error("issue with hashing password");
    error.status = 500;
    throw error;
  }
}
async function findUserByEmail(email) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!result) {
      const error = new Error("error with database finding user by email");
      error.status = 500;
      throw error;
    }

    if (result.rows[0]) {
      return result.rows[0];
    } else {
      const error = new Error("Cannot find user by email");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.error("Error finding user by email:", err);
    throw error;
  }
}
