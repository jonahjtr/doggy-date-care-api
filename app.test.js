const supertest = require("supertest");
const app = require("./server"); // Import your Express app
const pool = require("./config/db");

const happyUser = {
  username: "testUserjest1",
  email: "jestUserjest1@gmail.com",
  password: "jestUserjest1",
  first_name: "testssUser11",
  last_name: "testssUser11",
  date_of_birth: "1990-05-15",
  phone_number: "1234567890",
  state: "louisana",
  city: "New Orleans",
};

describe("POST REGISTER USER /auth/register", () => {
  // test("should return error code with 401 and username exists", async () => {
  //   const response = await supertest(app).post("/auth/register").send({
  //     username: "testUser23",
  //     email: "jestUser1@gmail.com",
  //     password: "jestUser1",
  //     first_name: "testssUser1",
  //     last_name: "testssUser1",
  //     date_of_birth: "2000-01-01",
  //     phone_number: "1234567890",
  //     state: "CA",
  //     city: "San Francisco",
  //   });
  //   // Expect a successful registration (e.g., 201 status code)
  //   expect(response.status).toBe(401);
  //   expect(response.body).toHaveProperty("error", "username already exists");
  //   // Verify that the response contains information about the registered user
  //   expect(response.body).toHaveProperty("username", "testUser23");
  //   expect(response.body).toHaveProperty("email", "jestUser1@gmail.com");
  //   expect(response.body).toHaveProperty("first_name", "testssUser1");
  //   // Add more assertions for other user properties as needed
  // });
  test("should return info on user", async () => {
    const response = await supertest(app)
      .post("/auth/register")
      .send(happyUser);
    // Expect a successful registration (e.g., 201 status code)
    expect(response.status).toBe(200);
    // Verify that the response contains information about the registered user
    expect(response.body).toHaveProperty("username", happyUser.username);
    expect(response.body).toHaveProperty("email", happyUser.email);
    expect(response.body).toHaveProperty("first_name", happyUser.first_name);
    // Add more assertions for other user properties as needed
  });
});

describe("POST Auth/login", () => {
  describe("happy path", () => {
    test("should respond with 200", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: happyUser.email,
        password: happyUser.password,
      });
      expect(response.status).toBe(200);
    });
    test("should respond with 200", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: happyUser.email,
        password: happyUser.password,
      });
      expect(response.body.message).toBe("Login successful");
      authToken = response.body.token;
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });
  });
  describe("unhappy paths", () => {
    test("should respond with 404 for incorrect email", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "nonexistentUser@gmail.com", // Incorrect email
        password: "testUser1",
      });

      // Expect a 404 status code for incorrect email
      expect(response.status).toBe(404);
    });
    //test for if email is same as another email

    test("should respond with 401 for incorrect password", async () => {
      const response = await supertest(app).post("/auth/login").send({
        email: "testUser1@gmail.com",
        password: "incorrectPassword", // Incorrect password
      });
      // Expect a 401 status code for incorrect password
      expect(response.status).toBe(401);
    });
  });
});

let authToken;
beforeAll(async () => {
  // Set up any necessary test environment or actions before running tests
  // For example, you could create a user account and obtain the authToken here
  const response = await supertest(app).post("/auth/login").send({
    email: "jestUserjest@gmail.com",
    password: "jestUserjest",
  });
  authToken = response.body.token;
});

afterAll(async () => {
  // Use the authToken to make a DELETE request to delete the user
  if (authToken) {
    await supertest(app)
      .delete("/auth/delete")
      .set("Authorization", `Bearer ${authToken}`);
  }
});
afterAll(async () => {
  await pool.end();
});
