const connection = require("../db/connection");
const endpoints = require("../endpoints.json");

exports.fetchEndpoints = () => {
  console.log(endpoints);
};
