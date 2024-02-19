/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("dogs", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.datetime("date_of_birth").notNullable();
    table.string("sex").notNullable();
    table.string("breed");
    table.string("profile_picture");
    table.timestamp("created_at");
    table.timestamp("updated_at");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.string("vet_name");
    table.integer("breed_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("dogs");
};
