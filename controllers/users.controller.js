const { fetchUserByID } = require('../models/users.model')

exports.getUserByID = (req, res, next) => {
    fetchUserByID(req.params).then(user => res.send({user}))
    .catch(err => next(err))
}