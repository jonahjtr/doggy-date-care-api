const request = require("supertest");
const app = require("../server");

async function performLogin() {
  const response = await request(app).post("/auth/login").send({
    password: "passwoasasdfdfrdisssme",
    name: "jonahjtrjtasdfasdfsdfasdfr",
    username: "jonahjtasdfrjasdfasdftrjtr",
    email: "tillmssssanasdfjonah@gmsdfail.com",
    age: 25,
    dob: "1998-08-05T05:00:00.000Z",
  });

  return response.body.token;
}
// POST
// api/users/create
describe("Test the POST /api/users/create route", () => {
  test("It should respond with 200 status code", async () => {
    const response = await request(app).post("/api/users/create").send({
      password: "passwoasasdfdfrdisssme",
      name: "jonahjtrjtasdfasdfsdfasdfr",
      username: "jonahjtasdfrjasdfasdftrjtr",
      email: "tillmssssanasdfjonah@gmsdfail.com",
      age: 25,
      dob: "1998-08-05T05:00:00.000Z",
    });
    expect(response.statusCode).toBe(200);
  });
});
// // /auth

// // POST auth/login
describe("Test the POST /auth/login route", () => {
  test("It should respond with 200 status code", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "passwoasasdfdfrdisssme",
      name: "jonahjtrjtasdfasdfsdfasdfr",
      username: "jonahjtasdfrjasdfasdftrjtr",
      email: "tillmssssanasdfjonah@gmsdfail.com",
      age: 25,
      dob: "1998-08-05T05:00:00.000Z",
    });
    expect(response.statusCode).toBe(200);
  });
  test("It should respond with token and refresh token", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "passwoasasdfdfrdisssme",
      name: "jonahjtrjtasdfasdfsdfasdfr",
      username: "jonahjtasdfrjasdfasdftrjtr",
      email: "tillmssssanasdfjonah@gmsdfail.com",
      age: 25,
      dob: "1998-08-05T05:00:00.000Z",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");

    const { token, refreshToken } = response.body;

    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
    expect(token).toMatch(jwtRegex);
    expect(refreshToken).toMatch(jwtRegex);
  });
});

// // api/users
// //GET

describe("Test the GET /api/users/single route", () => {
  let authToken;
  beforeAll(async () => {
    authToken = await performLogin();
  });

  test("It should access the protected endpoint with a valid token", async () => {
    const response = await request(app)
      .get("/api/users/single")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
  });
});

// PUT
describe("Test the PUT /api/users/edit route", () => {
  let authToken;
  beforeAll(async () => {
    authToken = await performLogin();
  });
  test("It should respond with 200 status code", async () => {
    const response = await request(app)
      .put("/api/users/edit")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "jonahjtrjtasdfasdfsdfasdfr",
        username: "jonahjtasdfrjasdfasdftrjtr",
        email: "tillmssssanasdfjonah@gmsdfail.com",
        age: 25,
        dob: "1998-08-05T05:00:00.000Z",
      });
    expect(response.statusCode).toBe(200);
  });
  test("It should respond with information", async () => {
    const response = await request(app)
      .put("/api/users/edit")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        password: "passwoasasdfdfrdisssme",
        name: "jonahjtrjtasdfasdfsdfasdfr",
        username: "jonahjtasdfrjasdfasdftrjtr",
        email: "tillmssssanasdfjonah@gmsdfail.com",
        age: 25,
        dob: "1998-08-05T05:00:00.000Z",
      });
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("age");
    expect(response.statusCode).toBe(200);
  });
});

//delete
// describe("Test the DELETE /api/users/delete route", () => {
//   let authToken;
//   beforeAll(async () => {
//     authToken = await performLogin();
//   });
//   test("It should respond with 200 status code", async () => {
//     const response = await request(app)
//       .delete("/api/users/delete")
//       .set("Authorization", `Bearer ${authToken}`)
//       .send({
//         password: "passwoasasdfdfrdisssme",
//         name: "jonahjtrjtasdfasdfsdfasdfr",
//         username: "jonahjtasdfrjasdfasdftrjtr",
//         email: "tillmssssanasdfjonah@gmsdfail.com",
//         age: 25,
//         dob: "1998-08-05T05:00:00.000Z",
//       });

//     expect(response.statusCode).toBe(200);
//   });
//test that the user is actually gone
// });
