const connection = require('../db/connection')

exports.fetchArticles = ({sort_by = 'articles.created_at', order = 'desc', author, topic}) => {
    let sortByCommentCount = false
    if (sort_by === 'comment_count'){
        sortByCommentCount = true
        sort_by = 'articles.created_at'
    }

    return connection('comments')
    .select('*')
    .then(commentsArr => {
        return connection('articles')
        .select('*')
        .orderBy(sort_by, order)
        .then(articlesArr => {
            articlesArr.forEach(article => {
                delete article.body
                article.comment_count = 
                commentsArr.filter(comment => comment.article_id === article.article_id).length

            })

            if (sortByCommentCount){

                const articlesSortedByComments = [...articlesArr].sort((a, b) => a.comment_count - b.comment_count)

                return order === 'asc' 
                ? articlesSortedByComments
                : articlesSortedByComments.reverse()
            }
           
            else return articlesArr
        })
    })

    // return connection('articles')
    // .join('comments', 'articles.article_id', 'comments.article_id')
    // .select('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_id')
    // .then(articlesArr => {

    //     articlesArr.forEach(article => {
    //         article.comment_count = 
    //     })

    // })
    
    
    // .then(articlesArray => {
        
        
        // let queriesArr = []
        // let baseQuery = connection.select('*').from('comments')
        // articlesArray.forEach(article => queriesArr.push(baseQuery.where('article_id', article.article_id)))
        
        // return Promise.all(queriesArr)
        // .then(x => console.log(x))

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
    // })
    
}

exports.fetchArticleByID = ({article_id}) => {

    return connection('articles')
    .join('comments', 'articles.article_id', 'comments.article_id')
    .select('articles.author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.body', 'articles.created_at', 'comments.comment_id')
    .where('articles.article_id', article_id)
    .then(articleArr => {

        let article = {...articleArr[0]}

        if (Object.keys(article).length === 0){

            return Promise.reject({status: 404})
        
        }
        
        else {
        
            article.comment_count = articleArr.length
            delete article.comment_id
            return [article]
        }
    })
}

exports.updateArticleVotes = ({article_id}, {inc_votes}) => {

    if (inc_votes === undefined){return Promise.reject({code: 'my-custom-code-400a'})}

    else 
    
    return connection('articles')
        .where({ article_id: article_id })
        .increment('votes', inc_votes)
        //.update('votes', inc_votes + 'votes') // Can this also work?
        .returning('*')
        .then(article => {
            if (Object.keys(article).length === 0){return Promise.reject({status: 404})}
            else return article
        })
}

exports.createNewCommentOnArticle = ({article_id}, {username, body}) => {

    return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .then(articlesArr => {
        if (articlesArr.length === 0){return Promise.reject({status: 404})}
        else{return articlesArr}
    })
    .then(() => {

        return connection.insert({article_id: article_id, author: username, body: body})
        .into('comments')
        .returning('*')

    })

    
    //Make sure newComment has the article_id inserted.



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