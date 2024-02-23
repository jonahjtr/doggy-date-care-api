/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("files").del();

  // Inserts seed entries
  await knex("files").insert([
    {
      file_name:
        ".e2def07e9f06c09a97c9fb996d57b9125cbec6c1ac0853fd91a84aaa646df55a",
      file_nickname: "File 1",
      dog_id: 1, // Assuming a dog with id 1 exists
      user_id: 1, // Assuming a user with id 1 exists
      upload_date: knex.fn.now(),
    },
    {
      file_name:
        "f901147da53d044af5bc8dafd731db68ea2ea6adc3167a563fba57c85f1fd005",
      file_nickname: "File 2",
      dog_id: 1, // Assuming a dog with id 1 exists
      user_id: 1, // Assuming a user with id 1 exists
      upload_date: knex.fn.now(),
    },
    {
      file_name: "exampleile_2.txt",
      file_nickname: "File 1",
      dog_id: 2, // Assuming a dog with id 2 exists
      user_id: 1, // Assuming a user with id 2 exists
      upload_date: knex.fn.now(),
    },
    {
      file_name: "exampl.txt",
      file_nickname: "File 2",
      dog_id: 2, // Assuming a dog with id 2 exists
      user_id: 1, // Assuming a user with id 2 exists
      upload_date: knex.fn.now(),
    },
  ]);
};
