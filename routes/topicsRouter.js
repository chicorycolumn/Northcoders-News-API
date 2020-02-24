const topicsRouter = require('express').Router() // still using express, right?
const { getTopics } = require('../controllers/topics.controller')
const {handle405s} = require('../errors/errors')

topicsRouter.route('/').get(getTopics).all(handle405s)

module.exports = topicsRouter