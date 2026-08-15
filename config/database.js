const Promise = require("promise");
const Pool = require("pg").Pool;
const connectionString = process.env.DATABASE_URL;

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "2Balloons",
  port: 8800,
});

module.exports = db;

// const db = new Pool({
//   connectionString: connectionString,
// });
