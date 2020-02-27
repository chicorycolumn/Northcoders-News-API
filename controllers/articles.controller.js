const {
  fetchArticleData,
  updateArticleVotes,
  createNewCommentOnArticle,
  fetchCommentsByArticle,
  createNewArticle,
  deleteArticleByID
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  fetchArticleData(req.params, req.query)
    .then(articles => {
      res.send({ articles });
    })
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

exports.postNewArticle = (req, res, next) => {
  createNewArticle(req.body)
    .then(article => res.status(201).send({ article }))
    .catch(err => {
      //console.log(err);
      next(err);
    });
};

exports.dropArticleByID = (req, res, next) => {
  deleteArticleByID(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => next(err));
};
