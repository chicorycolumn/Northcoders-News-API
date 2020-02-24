const connection = require('../connection.js') // Is this still the same?
// Wait, we don't have a connection.js file yet!

exports.updateCommentVotes = ({comment_id}, {inc_votes}) => {
    
    return connection('comments')
        .where({ comment_id: comment_id }) // need access keying?
        .update({votes: votes + parseInt(inc_votes)}) // does this work?
        .returning('*')
//    This takes an object in the form `{ inc_votes: newVote }`
//   `{ inc_votes : 1 }` would increment the current article's vote property by 1
//   `{ inc_votes : -100 }` would decrement the current article's vote property by 100
}

exports.dropComment = ({comment_id}) => { //responds w status 204 and no content
    return connection('comments')
        .where({ comment_id: comment_id })
        .del()
}


