/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("dates").del();
  await knex("dates").insert([
    {
      dog_id: 1,
      user_id: 1,
      date_time: "2023-04-20 14:30:00-05",
      start_date_time: "2023-04-20 14:30:00-05",
      end_date_time: "2023-04-20 15:30:00-05",
      location: "Park",
      description: "Walk in the park",
      title: "Morning Walk",
    },
    {
      dog_id: 2,
      user_id: 1,
      date_time: "2023-04-22 13:00:00-05",
      start_date_time: "2023-04-22 13:00:00-05",
      end_date_time: "2023-04-22 14:00:00-05",
      location: "Beach",
      description: "Play fetch",
      title: "Beach Day",
    },
    {
      dog_id: 3,
      user_id: 1,
      date_time: "2023-04-25 11:00:00-05",
      start_date_time: "2023-04-25 11:00:00-05",
      end_date_time: "2023-04-25 12:00:00-05",
      location: "Dog Park",
      description: "Socialize with other dogs",
      title: "Dog Park Visit",
    },
    {
      dog_id: 4,
      user_id: 2,
      date_time: "2023-04-21 10:00:00-05",
      start_date_time: "2023-04-21 10:00:00-05",
      end_date_time: "2023-04-21 11:00:00-05",
      location: "Trail",
      description: "Hiking",
      title: "Nature Walk",
    },
    {
      dog_id: 5,
      user_id: 2,
      date_time: "2023-04-23 12:00:00-05",
      start_date_time: "2023-04-23 12:00:00-05",
      end_date_time: "2023-04-23 13:00:00-05",
      location: "Lake",
      description: "Swimming",
      title: "Swim Time",
    },
    {
      dog_id: 6,
      user_id: 2,
      date_time: "2023-04-26 15:00:00-05",
      start_date_time: "2023-04-26 15:00:00-05",
      end_date_time: "2023-04-26 16:00:00-05",
      location: "Backyard",
      description: "Play fetch",
      title: "Backyard Playtime",
    },
  ]);
};
