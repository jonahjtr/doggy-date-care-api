/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("medicines").del();

  await knex("medicines").insert([
    {
      dog_id: 1,
      user_id: 1,
      name: "Painkiller",
      dosage: "10mg",
      frequency: "Twice daily",
      start_date: new Date("2024-02-17T08:00:00"),
      end_date: new Date("2024-02-24T08:00:00"),
      instructions: "Take with food",
      description: "For pain relief",
    },
    {
      dog_id: 1,
      user_id: 1,
      name: "Antibiotic",
      dosage: "5mg",
      frequency: "Once daily",
      start_date: new Date("2024-02-17T08:00:00"),
      end_date: new Date("2024-02-24T08:00:00"),
      instructions: "Take on an empty stomach",
      description: "For bacterial infection",
    },
    {
      dog_id: 1,
      user_id: 1,
      name: "Heartworm Preventative",
      dosage: "50mg",
      frequency: "Monthly",
      start_date: new Date("2024-02-01T08:00:00"),
      end_date: new Date("2025-02-01T08:00:00"),
      instructions: "Administer with food",
      description: "Prevents heartworm infection",
    },
    {
      dog_id: 1,
      user_id: 1,
      name: "Flea and Tick Treatment",
      dosage: "1 tablet",
      frequency: "Every 3 months",
      start_date: new Date("2024-02-01T08:00:00"),
      end_date: new Date("2024-05-01T08:00:00"),
      instructions: "Administer orally",
      description: "Prevents flea and tick infestation",
    },
    {
      dog_id: 1,
      user_id: 1,
      name: "Joint Supplement",
      dosage: "100mg",
      frequency: "Once daily",
      start_date: new Date("2024-01-01T08:00:00"),
      end_date: new Date("2024-12-31T08:00:00"),
      instructions: "Mix with food",
      description: "Supports joint health",
    },
    {
      dog_id: 2,
      user_id: 1,
      name: "Antibiotic",
      dosage: "5mg",
      frequency: "Once daily",
      start_date: new Date("2024-02-17T08:00:00"),
      end_date: new Date("2024-02-24T08:00:00"),
      instructions: "Take on an empty stomach",
      description: "For bacterial infection",
    },
    // Add more seed entries as needed
  ]);
};
