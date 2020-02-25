const usersRouter = require('express').Router() // still using express, right?
const { getUserByUsername } = require('../controllers/users.controller')
const {handle405s} = require('../errors/errors')

usersRouter.route('/:username')
    .get(getUserByUsername)
    .all(handle405s)

module.exports = usersRouter