/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("dogs").del();
  await knex("dogs").insert([
    {
      name: "Buddy",
      date_of_birth: "2018-05-10",
      sex: "Male",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 1,
      vet_name: "Dr. Smith",
    },
    {
      name: "Luna",
      date_of_birth: "2019-08-20",
      sex: "Female",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 1,
      vet_name: "Dr. Johnson",
    },
    {
      name: "Max",
      date_of_birth: "2017-03-15",
      sex: "Male",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 1,
      vet_name: "Dr. Lee",
    },
    // Add more dogs as needed
    // Dogs for user 2
    {
      name: "Charlie",
      date_of_birth: "2016-11-25",
      sex: "Male",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 2,
      vet_name: "Dr. Anderson",
    },
    {
      name: "Daisy",
      date_of_birth: "2020-02-12",
      sex: "Female",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 2,
      vet_name: "Dr. Martinez",
    },
    {
      name: "Rocky",
      date_of_birth: "2015-07-08",
      sex: "Male",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 2,
      vet_name: "Dr. Garcia",
    },
    // Add more dogs as needed
    // Dog 28
    {
      name: "Maximus",
      date_of_birth: "2020-11-12",
      sex: "Male",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 10,
      vet_name: "Dr. Hernandez",
    },
    // Dog 29
    {
      name: "Lola",
      date_of_birth: "2019-04-30",
      sex: "Female",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 10,
      vet_name: "Dr. Nguyen",
    },
    // Dog 30
    {
      name: "Thor",
      date_of_birth: "2018-09-01",
      sex: "Male",
      breed_id: 1, // Placeholder for breed_id
      profile_picture:
        "34d44f376adebd430dd2e299ae36fc0a3a7a4715ee7817dc91a03144e8c121f2",
      user_id: 10,
      vet_name: "Dr. Patel",
    },
  ]);
};
