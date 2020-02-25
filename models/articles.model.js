const connection = require('../db/connection')

exports.fetchArticles = () => {
    
    return connection('articles')
    .select('*')
    .then(articlesArray => {
        let count = articlesArray.length
        articlesArray.forEach(article => {
            delete article.body
        })
        return articlesArray
            
            console.log("Here's the article id from article")
            console.log(article.article_id)

            return connection('comments')
            .select('*')
            .where('article_id', article.article_id)
            .then(commentsForArticle => {
                count--
                //console.log("Here are the comments for this article")
                //console.log(commentsForArticle)
                
                article.comment_count = commentsForArticle.length
                //console.log("************************")
                //console.log(articlesArray)
                console.log(count)
                
            })
            .then(() => {if (count === 0){console.log("zerooooooooooo")}})
        
        
        
    })
    
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


exports.fetchCommentsByArticle = ({article_id}, {sort_by = 'created_at', order = 'desc'}) => {
    //console.log(`req.params is ${sort_by} and ${order}`)
    return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', article_id)
}