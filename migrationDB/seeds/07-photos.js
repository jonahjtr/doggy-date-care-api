/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("photos").del();

  // Inserts seed entries
  await knex("photos").insert([
    {
      dog_id: 1,
      user_id: 1,
      photo_name:
        "f285e5b6d8a1f608b8b0906fc5aedd23713e7fedf0b1eb72b3807738af95220b",
    },
    {
      dog_id: 1,
      user_id: 1,
      photo_name:
        "dd9e98d00d302b983f717fe1ae5538412fc8037df4aff13e2f3b2ff9c481fcb3",
    },
    {
      dog_id: 1,
      user_id: 1,
      photo_name:
        "9cac786865368df56f90882ca4122801b485f0f933a4e34b5c55ca71689182c2",
    },
    {
      dog_id: 1,
      user_id: 1,
      photo_name:
        "a9d69f6e98367e9c369375893afbfda89d209a752987c6c00b2bf63d2bc755ce",
    },
  ]);
};
