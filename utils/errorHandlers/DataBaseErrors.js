class DatabaseError extends Error {
  constructor(message = "Database operation failed") {
    super(message);
    this.name = this.constructor.name;
    this.status = 500;
  }
}

// Usage:
// try {
//   // ... database operation that may fail
//   throw new DatabaseError("Unable to connect to the database");
// } catch (error) {
//   if (error instanceof DatabaseError) {
//     console.error(`${error.name}: ${error.message}`);
//     console.error(`Status Code: ${error.status}`);
//     // Handle database errors
//   } else {
//     // Handle other types of errors
//   }
// }
