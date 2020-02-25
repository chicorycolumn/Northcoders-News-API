const { updateCommentVotes, deleteCommentByID } = require('../models/comments.model')

exports.patchCommentVotes = (req, res, next) => {
    updateCommentVotes(req.params, req.body)
    .then(comment => res.send({comment}))
    .catch(err => next(err))
}

exports.dropCommentByID = (req, res, next) => {
    deleteCommentByID(req.params)
    .then(x => res.status(204).send(x))
    .catch(err => next(err))
}