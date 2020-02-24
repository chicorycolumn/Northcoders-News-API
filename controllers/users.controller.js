const { fetchUserByID } = require('../models/users.model')

exports.getUserByID = (req, res, next) => {
    fetchUserByID(req.query).then(user => res.send({user}))
    .catch(err => next(err))
}