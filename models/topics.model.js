const connection = require('../connection.js') // Is this still the same?
// Wait, we don't have a connection.js file yet!

exports.fetchTopics = () => {
    
    return connection('topics')
    .select('*')

}