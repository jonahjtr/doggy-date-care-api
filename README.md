# To get started

1. clone repo
2. npm I
3. knex migrate:latest
4. knex seed:run
5. login !
   email: user1@example.com
   password: password1

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
