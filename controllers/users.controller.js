const { fetchUserByUsername } = require('../models/users.model')

exports.getUserByUsername = (req, res, next) => {
    fetchUserByUsername(req.params).then(user => res.send({user}))
    .catch(err => next(err))
}