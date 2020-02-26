const connection = require('../db/connection.js')
exports.fetchUserByUsername = ({username}) => {
    return connection('users')
    .select('*')
    .where({username: username})
    .then(userArray => {
        if (userArray.length === 0){
            return Promise.reject({status: 404, customStatus: '404a'})
        } else {
            return userArray[0]
        }
    })
}