const apiDoubleRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api.controller");
const { handle405s } = require("../errors/errors");

apiDoubleRouter
  .route("/")
  .get(getEndpoints)
  .all(handle405s);

module.exports = apiDoubleRouter;
