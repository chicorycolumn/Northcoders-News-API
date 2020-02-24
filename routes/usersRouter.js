const usersRouter = require('express').Router() // still using express, right?
const { getUserByID } = require('../controllers/users.controller')


usersRouter.route('/:username').get(getUserByID).all(handle405s)

module.exports = usersRouter