const {
  fetchArticleData,
  updateArticleVotes,
  createNewCommentOnArticle,
  fetchCommentsByArticle
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  fetchArticleData(req.params, req.query)
    .then(articles => res.send({ articles }))
    .catch(err => next(err));
};

exports.getArticleByID = (req, res, next) => {
  fetchArticleData(req.params, req.query)
    .then(article => res.send({ article }))
    .catch(err => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  updateArticleVotes(req.params, req.body)
    .then(article => res.send({ article }))
    .catch(err => next(err));
};

exports.postNewCommentOnArticle = (req, res, next) => {
  createNewCommentOnArticle(req.params, req.body)
    .then(comment => res.status(201).send({ comment }))
    .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  fetchCommentsByArticle(req.params, req.query)
    .then(comments => res.send({ comments }))
    .catch(err => next(err));
};
