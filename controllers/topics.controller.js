const { fetchTopics } = require('../models/topics.model')

exports.getTopics = (req, res, next) => {
    fetchTopics().then(topics => res.send({topics}))
    .catch(err => next(err))
}