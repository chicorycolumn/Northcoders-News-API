const connection = require("../db/connection");

/* 
  I quite liked the way I had solved the "author or topic or both or neither" url query problem in fetchArticles, prior 
  to our Weds lecture on `modify`. What I did was to default the author and topic arguments to '%' wildcard, like so: 
  
    exports.fetchArticles = ({sort_by = 'articles.created_at', order = 'desc', author = '%', topic = '%', ...badUrlQueries}) => {

  and then use them in the knex query like so:

  .where('topic', 'like', topic).andWhere('author', 'like', author)
*/

exports.fetchArticleData = (
  { article_id },
  {
    sort_by = "articles.created_at",
    order = "desc",
    author,
    topic,
    ...badUrlQueries
  }
) => {
  if (Object.keys(badUrlQueries).length) {
    return Promise.reject({ status: 400, customStatus: "400c" });
  } else
    return connection
      .from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .count({ comment_count: "comments.article_id" })
      .groupBy("articles.article_id")
      .modify(queryBuilder => {
        if (author !== undefined) {
          queryBuilder.where("articles.author", author);
        }
        if (topic !== undefined) {
          queryBuilder.where("articles.topic", topic);
        }
      })
      .orderBy(sort_by, order)

      .modify(queryBuilder => {
        if (article_id !== undefined) {
          //Endpoint wants one article.
          queryBuilder.where("articles.article_id", article_id).first(
            "articles.author",
            "articles.title",
            "articles.article_id",
            "articles.votes",
            //"articles.topic", // Not desired at endpoint.
            "articles.body",
            "articles.created_at"
          );
        } else {
          // Endpoint wants many articles.
          queryBuilder.select(
            "articles.author",
            "articles.title",
            "articles.article_id",
            "articles.votes",
            "articles.topic",
            //"articles.body", // Not desired at endpoint.
            "articles.created_at"
          );
        }
      })

      .then(articleData => {
        if (articleData === undefined) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else if (Array.isArray(articleData)) {
          if (articleData.length === 0) {
            return Promise.reject({ status: 404, customStatus: "404b" });
          } else {
            articleData.forEach(
              item => (item.comment_count = parseInt(item.comment_count))
            );
            return articleData;
          }
        } else articleData.comment_count = parseInt(articleData.comment_count);
        return articleData;
      });
};

exports.updateArticleVotes = ({ article_id }, requestBody) => {
  const inc_votes = requestBody.inc_votes;

  if (inc_votes === undefined || Object.keys(requestBody).length > 1) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  } else
    return connection("articles")
      .where({ article_id: article_id })
      .increment("votes", inc_votes)
      .returning("*")
      .then(articles => {
        if (articles.length === 0) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else return articles[0];
      });
};

exports.createNewCommentOnArticle = ({ article_id }, { username, body }) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(articlesArr => {
      if (articlesArr.length === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      } else {
        return articlesArr;
      }
    })
    .then(() => {
      return connection
        .insert({ article_id: article_id, author: username, body: body })
        .into("comments")
        .returning("*")
        .then(commentArr => {
          return commentArr[0];
        });
    });
};

exports.fetchCommentsByArticle = (
  { article_id },
  { sort_by = "created_at", order = "desc", ...badUrlQueries }
) => {
  if (Object.keys(badUrlQueries).length) {
    return Promise.reject({ status: 400, customStatus: "400c" });
  } else
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .where("article_id", article_id)
      .orderBy(sort_by, order)
      .then(commentsArr => {
        if (commentsArr.length === 0) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else {
          return commentsArr;
        }
      });
};

//BACK WHEN fetchArticleData was two separate Model Functions: fetchArticles and fetchArticleByID. Perhaps this was better!

// exports.fetchArticles = ({sort_by = 'articles.created_at', order = 'desc', author = '%', topic = '%', ...badUrlQueries}) => {

//     if (Object.keys(badUrlQueries).length){return Promise.reject({status: 400, customStatus: '400c'})}

//     let sortByCommentCount = false
//     if (sort_by === 'comment_count'){
//         sortByCommentCount = true
//         sort_by = 'articles.created_at'
//     }

//     return connection('comments')
//     .select('*')
//     .then(commentsArr => {
//         return connection('articles')
//         .select('author', 'title', 'article_id', 'topic', 'created_at', 'votes')
//         .where('topic', 'like', topic)
//         .andWhere('author', 'like', author)
//         .orderBy(sort_by, order)

//         .then(articlesArr => {
//             if (articlesArr.length === 0){return Promise.reject({status: 404, customStatus: '404b'})}else

//             articlesArr.forEach(article => {
//                 article.comment_count =
//                 commentsArr.filter(comment => comment.article_id === article.article_id).length
//             })

//             if (sortByCommentCount){

//                 const articlesSortedByComments = [...articlesArr].sort((a, b) => a.comment_count - b.comment_count)

//                 return order === 'asc'
//                 ? articlesSortedByComments
//                 : articlesSortedByComments.reverse()
//             }

//             else return articlesArr
//         })
//     })
// }

// exports.fetchArticleByID = ({article_id}) => {

//     return connection('articles')
//     .join('comments', 'articles.article_id', 'comments.article_id')
//     .select('articles.author', 'articles.title', 'articles.article_id', 'articles.votes', 'articles.body', 'articles.created_at', 'comments.comment_id')
//     .where('articles.article_id', article_id)
//     .then(articleArr => {

//         let article = {...articleArr[0]}

//         if (Object.keys(article).length === 0){

//             return Promise.reject({status: 404, customStatus: '404a'})

//         }

//         else {

//             article.comment_count = articleArr.length
//             delete article.comment_id
//             return article
//         }
//     })
// }
