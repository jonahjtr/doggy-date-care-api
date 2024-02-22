/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("files", (table) => {
    table.increments("file_id").primary();
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
    table.string("file_name").notNullable();
    table.string("file_nickname").notNullable();
    table.string("upload_date");
    table.timestamps("upload_dates");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("files");
};
