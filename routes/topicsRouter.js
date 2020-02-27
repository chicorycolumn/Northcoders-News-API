const topicsRouter = require("express").Router(); // still using express, right?
const { getTopics, postNewTopic } = require("../controllers/topics.controller");
const { handle405s } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postNewTopic)
  .all(handle405s);

module.exports = topicsRouter;
