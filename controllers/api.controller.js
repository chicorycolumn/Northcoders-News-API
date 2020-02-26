const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then(endpoints => {
      console.log("in cont");

      res.send({ endpoints });
    })
    .catch(err => next(err));
};
