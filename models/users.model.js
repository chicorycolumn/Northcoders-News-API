const connection = require("../db/connection.js");

exports.updateUserDetails = (
  { username },
  { name, avatar_url, ...badKeys },
  queries
) => {
  console.log("moooooooooooooooooooood");
  if (Object.keys(badKeys).length > 0) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  } else
    return connection("users")
      .where({ username: username })
      .modify(queryBuilder => {
        if (avatar_url !== undefined) {
          queryBuilder = queryBuilder.update({
            avatar_url: avatar_url
          });
        }
      })
      .modify(queryBuilder => {
        if (name !== undefined) {
          queryBuilder = queryBuilder.update({
            name: name
          });
        }
      })
      .returning("*")
      .then(userArr => {
        if (userArr.length === 0) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else return userArr[0];
      });
};

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
