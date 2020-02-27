const connection = require("../db/connection.js");
exports.fetchUserByUsername = ({ username }) => {
  return connection("users")
    .select("*")
    .where({ username: username })
    .then(userArray => {
      if (userArray.length === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      } else {
        return userArray[0];
      }
    });
};

exports.fetchUsers = () => {
  return connection("users").select("*");
};

exports.createNewUser = ({
  name,
  username,
  avatar_url,
  ...unnecessaryKeys
}) => {
  if (Object.keys(unnecessaryKeys).length) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  }

  return connection
    .insert({
      name: name,
      avatar_url: avatar_url,
      username: username
    })
    .into("users")
    .returning("*")
    .then(userArr => {
      return userArr[0];
    });
};
