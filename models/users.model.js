const connection = require('../connection.js') // Is this still the same?
// Wait, we don't have a connection.js file yet!

exports.fetchUserByID = ({user_id}) => {
    
    return connection('users')
    .select('*')

    //Might this fail because user_id needs accessing key??

    .where({user_id: user_id})
    //.orderBy(sort_by, order)
    //.then(x => x)
}