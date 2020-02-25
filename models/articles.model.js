const connection = require('../db/connection')

exports.fetchArticles = ({sort_by = 'articles.created_at', order = 'desc', author = '%', topic = '%', ...badUrlQueries}) => {

    if (Object.keys(badUrlQueries).length){return Promise.reject({status: 400, customStatus: '400c'})}

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
        .where('topic', 'like', topic)
        .andWhere('author', 'like', author)
        .orderBy(sort_by, order)

        .then(articlesArr => {
            if (articlesArr.length === 0){return Promise.reject({status: 404, customStatus: '404b'})}else

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
}

exports.fetchArticleByID = ({article_id}) => {

    return connection('articles')
    .join('comments', 'articles.article_id', 'comments.article_id')
    .select('articles.author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.body', 'articles.created_at', 'comments.comment_id')
    .where('articles.article_id', article_id)
    .then(articleArr => {

        let article = {...articleArr[0]}

        if (Object.keys(article).length === 0){

            return Promise.reject({status: 404, customStatus: '404a'})
        
        }
        
        else {
        
            article.comment_count = articleArr.length
            delete article.comment_id
            return [article]
        }
    })
}

exports.updateArticleVotes = ({article_id}, requestBody) => {

    const inc_votes = requestBody.inc_votes

    if (inc_votes === undefined || Object.keys(requestBody).length>1){return Promise.reject({status: 400, customStatus: '400a'})}
    else 
    
    return connection('articles')
        .where({ article_id: article_id })
        .increment('votes', inc_votes)
        //.update('votes', inc_votes + 'votes') // Can this also work?
        .returning('*')
        .then(article => {
            if (Object.keys(article).length === 0){return Promise.reject({status: 404, customStatus: '404a'})}
            else return article
        })
}

exports.createNewCommentOnArticle = ({article_id}, {username, body}) => {

    return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .then(articlesArr => {
        if (articlesArr.length === 0){return Promise.reject({status: 404, customStatus: '404a'})}
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
    return connection
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where('article_id', article_id)
    .orderBy(sort_by, order)
    .then(commentsArr => {
        if (commentsArr.length === 0){return Promise.reject({status: 404, customStatus: '404a'})}
        else{return commentsArr}
    })
}