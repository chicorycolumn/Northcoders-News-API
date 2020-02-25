const connection = require('../db/connection.js')
exports.fetchUserByUsername = ({username}) => {
    return connection('users')
    .select('*')
    .where({username: username})
    .then(userArray => {
        if (userArray.length === 0){
            return Promise.reject({status: 404, msg: 'This resource was not found, my friend.'})
        } else {
            return userArray
        }
    })
}