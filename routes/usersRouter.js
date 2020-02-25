const usersRouter = require('express').Router() // still using express, right?
const { getUserByID } = require('../controllers/users.controller')
const {handle405s} = require('../errors/errors')

usersRouter.route('/:username')
    .get(getUserByID)
    .all(handle405s)

module.exports = usersRouter