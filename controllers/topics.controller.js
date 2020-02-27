const { fetchTopics, createNewTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => res.send({ topics }))
    .catch(err => next(err));
};

exports.postNewTopic = (req, res, next) => {
  createNewTopic(req.body)
    .then(topic => res.status(201).send({ topic }))
    .catch(err => {
      next(err);
    });
};
