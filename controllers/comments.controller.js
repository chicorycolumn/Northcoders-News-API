const { updateCommentVotes, dropComment } = require('../models/comments.model')

exports.patchCommentVotes = (req, res, next) => {
    updateCommentVotes(req.params, req.body)
    .then(article => res.send({article}))
    .catch(err => next(err))
}

exports.deleteComment = (req, res, next) => {
    dropComment(req.params)
    .then(x => res.send(x))
    .catch(err => next(err))
}