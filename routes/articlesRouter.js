const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleByID,
  patchArticleVotes,
  postNewCommentOnArticle,
  getCommentsByArticle,
  postNewArticle,
  dropArticleByID,
  patchArticleDetails,
  getArticleVotesJunctionTable
} = require("../controllers/articles.controller");
const { handle405s } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postNewArticle)
  .all(handle405s);

articlesRouter
  .route("/votes")
  .get(getArticleVotesJunctionTable)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(patchArticleDetails)
  .delete(dropArticleByID)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postNewCommentOnArticle)
  .all(handle405s);

module.exports = articlesRouter;
