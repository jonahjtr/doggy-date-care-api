var options = {
  development: {
    client: "pg",
    connection: "postgres://localhost/doggy_date_care_migrations",
    migrations: {
      directory: "./migrationDB/migrations",
    },
    seeds: {
      directory: "./migrationDB/seeds",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrationDB/migrations",
    },
    seeds: {
      directory: "./migrationDB/seeds/production",
    },
  },
};

module.exports = options;
