const connection = require('../connection.js') // Is this still the same?
// Wait, we don't have a connection.js file yet!

exports.fetchArticles = () => {
    
    return connection('articles')
    .select('*')
    
}

exports.fetchArticleByID = ({article_id}) => {
    
    return connection('articles')
    .select('*')
    .where('article_id', article_id)
    
}

exports.updateArticleVotes = ({article_id}, {inc_votes}) => {
    
    return connection('articles')
        .where({ article_id: article_id }) // need access keying?
        .update({votes: votes + parseInt(inc_votes)}) // does this work?
        .returning('*')

//    This takes an object in the form `{ inc_votes: newVote }`
//   `{ inc_votes : 1 }` would increment the current article's vote property by 1
//   `{ inc_votes : -100 }` would decrement the current article's vote property by 100
    
}

exports.createNewCommentOnArticle = ({article_id}, newComment) => {
    
    //Make sure newComment has the article_id inserted.

    return connection.insert(newComment)
        .into('comments')
        .returning('*')

}


exports.fetchCommentsByArticle = ({article_id}) => {
    
    return connection('comments')
    .select('*')
    .where('article_id', article_id)
}