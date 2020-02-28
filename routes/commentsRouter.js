const commentsRouter = require("express").Router(); // still using express, right?
const {
  patchCommentDetails,
  dropCommentByID,
  getCommentByID
} = require("../controllers/comments.controller");
const { handle405s } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .delete(dropCommentByID)
  .patch(patchCommentDetails)
  .get(getCommentByID)
  .all(handle405s);

module.exports = commentsRouter;
