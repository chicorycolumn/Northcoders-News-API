const connection = require("../db/connection.js");

exports.fetchTopics = () => {
  return connection("topics").select("*");
};

exports.createNewTopic = ({ description, slug, ...unnecessaryKeys }) => {
  if (Object.keys(unnecessaryKeys).length) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  }

  return connection
    .insert({
      description: description,
      slug: slug
    })
    .into("topics")
    .returning("*")
    .then(topicArr => {
      return topicArr[0];
    });
};
