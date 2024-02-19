/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("breed", (table) => {
    table.increments("breed_id").primary();
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
    table.string("breed_name").notNullable();
    table.string("size");
    table.jsonb("characteristics");
    table.string("temperment");
    table.string("exercise_needs");
    table.string("health_issues_and_lifespan");
    table.string("grooming_needs");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("breed");
};
