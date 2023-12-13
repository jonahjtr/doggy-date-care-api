## users

3 test users
5 dogs for each user

# test user1

username: testUser1
email: testUser1@gmail.com
password: testUser1

# test user2

username: testUser2
email: testUser2@gmail.com
password: testUser2

# test User3

username: testUser3
email: testUser3@gmail.com
password: testUser3

      [ Authentication ]

+-------------------------+
| POST /auth/login |
| POST /auth/register |
| DELETE /auth/delete |
| DELETE /auth/logout |
+-------------------------+

        [ User ]

+-------------------------+
| GET /user/profile |
+-------------------------+

       [ Dog ]

+-------------------------+
| GET /dogs |
| GET /dogs/:id |
| PUT /dogs/:id |
| POST /dogs |
| DELETE /dogs/:id |
+-------------------------+
|
| [ Medicine ]
+---------------------+
| GET /dogs/:id/medicine |
| POST /dogs/:id/medicine |
| PUT /dogs/:id/medicine/:id |
| DELETE /dogs/:id/medicine/:id |
+---------------------+
