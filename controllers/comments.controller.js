const { updateCommentVotes, deleteCommentByID } = require('../models/comments.model')

exports.patchCommentVotes = (req, res, next) => {
    updateCommentVotes(req.params, req.body)
    .then(comment => res.send({comment}))
    .catch(err => next(err))
}

exports.dropCommentByID = (req, res, next) => {
    deleteCommentByID(req.params)
    .then(() => {res.status(204).send()})
    .catch(err => next(err))
}