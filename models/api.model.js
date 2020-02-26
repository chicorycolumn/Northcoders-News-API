const connection = require("../db/connection");
const endpoints = require("../endpoints.json");

exports.fetchEndpoints = () => {
  return Promise.all([endpoints]).then(array => {
    return array[0];
  });
};
