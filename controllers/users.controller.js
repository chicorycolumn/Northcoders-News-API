const {
  fetchUsers,
  createNewUser,
  updateUserDetails
} = require("../models/users.model");

exports.patchUserDetails = (req, res, next) => {
  updateUserDetails(req.params, req.body)
    .then(user => res.send({ user }))
    .catch(err => next(err));
};

exports.getUserByUsername = (req, res, next) => {
  //console.log("get userbyusername con###########");
  fetchUsers(req.params)
    .then(userArr => {
      const user = userArr[0]; // !!!!
      res.send({ user });
    })
    .catch(err => next(err));
};

exports.getUsers = (req, res, next) => {
  // console.log("get user con###########");
  fetchUsers({})
    .then(users => res.send({ users }))
    .catch(err => next(err));
};

exports.postNewUser = (req, res, next) => {
  createNewUser(req.body)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(err => {
      next(err);
    });
};
