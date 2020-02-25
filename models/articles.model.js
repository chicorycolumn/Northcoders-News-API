const connection = require('../db/connection')

exports.fetchArticles = () => {
    
    return connection('articles')
    .select('author', 'title', 'article_id', 'topic', 'created_at', 'votes')
    .then(articlesArray => {
        
        
        let queriesArr = []
        let baseQuery = connection.select('*').from('comments')
        articlesArray.forEach(article => queriesArr.push(baseQuery.where('article_id', article.article_id)))
        
        return Promise.all(queriesArr)
        .then(x => console.log(x))

        //return articlesArray
            
        // return connection
        // .select('*')
        // .from('comments')
        // .where('article_id', 1)
        // .then(comArr => {console.log(comArr.length)})

        // articlesArray.forEach(article => {
            
        //     return Promise.all([article, connection
        //         .select('*')
        //         .from('comments')
        //         .where('article_id', 1)])
        //         .then(comArr => {
        //             //article.comment_count = comArr.length
        //             console.log(comArr.length, article)
                    
        //         })
        // })

            // console.log("Here's the article id from article")
            // console.log(article.article_id)

            // return connection('comments')
            // .select('*')
            // .where('article_id', article.article_id)
            // .then(commentsForArticle => {
            //     count--
            //     //console.log("Here are the comments for this article")
            //     //console.log(commentsForArticle)
                
            //     article.comment_count = commentsForArticle.length
            //     //console.log("************************")
            //     //console.log(articlesArray)
            //     console.log(count)
                
            // })
            // .then(() => {if (count === 0){console.log("zerooooooooooo")}})
        
        
        
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

exports.createNewCommentOnArticle = ({article_id}, {username, body}) => {
    
    console.log(article_id, username, body)
    //Make sure newComment has the article_id inserted.

    return connection.insert({article_id: article_id, author: username, body: body})
        .into('comments')
        .returning('*')

}


exports.fetchCommentsByArticle = ({article_id}, {sort_by = 'created_at', order = 'desc'}) => {
    //console.log(`req.params is ${sort_by} and ${order}`)
    return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', article_id)
    .orderBy(sort_by, order)
    .then(commentsArr => {
        if (commentsArr.length === 0){return Promise.reject({status: 404})}
        else{return commentsArr}
    })
}