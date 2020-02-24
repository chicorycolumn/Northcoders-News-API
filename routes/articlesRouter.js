const articlesRouter = require('express').Router() // still using express, right?
const { getArticles, getArticleByID, patchArticleVotes, postNewCommentOnArticle, getCommentsByArticle } = require('../controllers/articles.controller')
const {handle405s} = require('../errors/errors')

articlesRouter.route('/')
    .get(getArticles)
    .all(handle405s) // Should this 405 still be here?

articlesRouter.route('/:article_id')
    .get(getArticleByID)
    .post(patchArticleVotes)
    .all(handle405s)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(postNewCommentOnArticle)
    .all(handle405s)

module.exports = topicsRouter