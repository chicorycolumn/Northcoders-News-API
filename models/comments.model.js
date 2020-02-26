const connection = require('../db/connection.js')

exports.updateCommentVotes = ({comment_id}, requestBody) => {
    const inc_votes = requestBody.inc_votes

    if (inc_votes === undefined || Object.keys(requestBody).length>1){return Promise.reject({status: 400, customStatus: '400a'})}
    
    else 
    return connection('comments')
        .where({ comment_id: comment_id })
        .increment('votes', inc_votes)
        .returning('*')
        .then(comments => {
            if (comments.length === 0){return Promise.reject({status: 404, customStatus: '404a'})}
            else return comments[0]
        })
}

exports.updateArticleVotes = ({article_id}, {inc_votes, ...unnecessaryValues}) => {

    if (inc_votes === undefined || Object.keys(unnecessaryValues).length>1){return Promise.reject({status: 400, customStatus: '400a'})}
    else 
    
    return connection('articles')
        .where({ article_id: article_id })
        .increment('votes', inc_votes)
        .returning('*')
        .then(article => {
            if (Object.keys(article).length === 0){return Promise.reject({status: 404, customStatus: '404a'})}
            else return article
        })
}

exports.deleteCommentByID = ({comment_id}) => {
    return connection('comments')
        .where({ comment_id: comment_id })
        .del()
        .then(numberRowsDeleted => {
            if (numberRowsDeleted === 0){return Promise.reject({status: 404, customStatus: '404a'})}
            else return numberRowsDeleted
        })
}



