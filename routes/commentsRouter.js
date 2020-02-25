const commentsRouter = require('express').Router() // still using express, right?
const { patchCommentVotes, dropCommentByID } = require('../controllers/comments.controller')
const {handle405s} = require('../errors/errors')

commentsRouter.route('/:comment_id')
    .delete(dropCommentByID)
    .patch(patchCommentVotes)
    .all(handle405s)

module.exports = commentsRouter