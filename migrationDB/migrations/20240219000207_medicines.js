/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("medicines", (table) => {
    table.increments("id").primary();
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
    table.string("name").notNullable();
    table.string("dosage").notNullable();
    table.string("frequency").notNullable();
    table.dateTime("start_date").notNullable();
    table.dateTime("end_date").notNullable();
    table.string("instructions");
    table.string("description").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("medicines");
};
