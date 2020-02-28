const {
  updateCommentDetails,
  deleteCommentByID,
  fetchCommentByID
} = require("../models/comments.model");

exports.patchCommentDetails = (req, res, next) => {
  updateCommentDetails(req.params, req.body, req.query)
    .then(comment => res.send({ comment }))
    .catch(err => next(err));
};

exports.getCommentByID = (req, res, next) => {
  fetchCommentByID(req.params)
    .then(comment => res.send({ comment }))
    .catch(err => next(err));
};

exports.dropCommentByID = (req, res, next) => {
  deleteCommentByID(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => next(err));
};
