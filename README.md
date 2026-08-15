# Doggy Date Care API

## users

3 test users
5 dogs for each user

# test user1

username: testUser1
email: testUser1@gmail.com

# test user2

username: testUser2
email: testUser2@gmail.com

# test user3

username: testUser3
email: testUser3@gmail.com

# Routes

| [ Auth ]            |
+---------------------+
| GET /auth/me        |
| GET /auth/google    |
| GET /auth/logout    |
+---------------------+

| [ User ]            |
+---------------------+
| GET /user           |
| GET /user/:id       |
| PUT /user/:id       |
| DELETE /user/:id    |
+---------------------+

| [ Dogs ]            |
+---------------------+
| GET /dogs           |
| GET /dogs/:id       |
| POST /dogs          |
| PUT /dogs/:id       |
| DELETE /dogs/:id    |
+---------------------+

| [ Calendar ]        |
+---------------------+
| GET /dogs/:id/calendar |
| POST /dogs/:id/calendar |
| PUT /dogs/:id/calendar/:id |
| DELETE /dogs/:id/calendar/:id |
+---------------------+

| [ Files ]           |
+---------------------+
| GET /dogs/:id/files |
| POST /dogs/:id/files |
| DELETE /dogs/:id/files/:id |
+---------------------+

| [ Medicine ]        |
+---------------------+
| GET /dogs/:id/medicine |
| POST /dogs/:id/medicine |
| PUT /dogs/:id/medicine/:id |
| DELETE /dogs/:id/medicine/:id |
+---------------------+

| [ Photos ]          |
+---------------------+
| GET /dogs/:id/photos |
| POST /dogs/:id/photos |
| DELETE /dogs/:id/photos/:id |
+---------------------+

---

## Auth Rewrite (JWT)

Additional JWT-based auth routes added via auth-rewrite:

| [ JWT Auth ]        |
+---------------------+
| POST /jwt/auth      |
| GET /jwt/users      |
+---------------------+

## License
MIT
