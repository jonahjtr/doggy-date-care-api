const User = require("../../models/user.model");

// GET

//-- GET all users
module.exports.getUsers = (req, res) => {
  // console.log(req.body);npm
  User.findAll()
    .then((results) => {
      const { name, username, email, dob, age } = results;
      res.status(200).json({ results });
    })
    .catch((e) => e);
};

//--GET Single users
module.exports.getUserById = (req, res) => {
  User.findOne({ id: req.userId })
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((e) => e);
};

// POST
module.exports.createUser = (req, res) => {
  User.create(req.body)
    .then(function (result) {
      // console.log(result);
      res.status(200).send({ message: `User added with ID:}` });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};
// PUT
module.exports.updateUser = (req, res, use) => {
  const { name, email, password, age } = req.body;

  User.update({
    id: req.userId,
    name: name,
    email: email,
    age: age,
  })

    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => err);
};

// DELETE
module.exports.deleteUser = (req, res) => {
  User.delete({ id: req.userId }).then(() => {
    res.status(200).send(`User deleted with ID: ${req.userId}`);
  });
};
