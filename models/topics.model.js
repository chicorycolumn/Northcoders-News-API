const connection = require('../db/connection.js')

exports.fetchTopics = () => {
    
    return connection('topics')
    .select('*')

}