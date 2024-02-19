/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dates", (table) => {
    table.increments("date_id").primary();
    table
      .integer("dog_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("dogs");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.timestamp("date_time");
    table
      .specificType("start_date_time", "timestamp with time zone")

      .notNullable();
    table
      .specificType("end_date_time", "timestamp with time zone")

      .notNullable();
    table.string("location");
    table.string("description").notNullable();
    table.string("title").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("dates");
};
