const db = require("../config/db");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

module.exports = {
  create: async function (data) {
    try {
      await validateUserData(data);
      const {
        username,
        email,
        password,
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        state,
        city,
      } = data;
      const hashedPassword = await hashPassword(password);
      const query =
        "INSERT INTO users (username, email, password, first_name, last_name, date_of_birth, phone_number, state, city, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
      const values = [
        username,
        email,
        hashedPassword,
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        state,
        city,
        "user",
      ];

      const result = await pool.query(query, values);
      // console.log("logging result inside create", result.rows[0]);
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        throw new Error("User creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  verifyUser: async function (req, res, email, password) {
    try {
      const data = { email: email, password: password };
      await validateUserData(data);

      const user = await findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const token = jwt.sign(
          {
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
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
          },
          process.env.SECRET_KEY_JWT,
          { expiresIn: "7d" }
        );

        console.log("token", token);
        console.log("refreshtoken", refreshToken);

        res.status(200).json({
          message: "Login successful",
          token,
          refreshToken,
          redirectTo: "/homepage",
        });
      } else {
        throw "Incorrect password";
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  delete: async function (data) {
    try {
      const user = await findUserByEmail(data.email);

      if (!user) {
        return { success: false, error: "User not found" };
      } else {
        const query = "DELETE FROM users WHERE email = $1";
        const result = await pool.query(query, [data.email]);

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
