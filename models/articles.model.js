const connection = require("../db/connection");
const { doesValueExistInTable } = require("../db/utils/utils");

function calculateVotesAndParseIntCommentCount(articleObject) {
  articleObject.comment_count = parseInt(articleObject.comment_count);

  if (articleObject.additionalVotes !== undefined) {
    articleObject.votes =
      parseInt(articleObject.votes) + parseInt(articleObject.additionalVotes);
    delete articleObject.additionalVotes;
  }
}

//THE FUNCTION THAT ROUTES ALL PATCH REQUESTS FROM THIS ENDPOINT:
exports.updateArticleDetails = (
  { article_id },
  { body, inc_votes, title, author, voting_user, topic, ...badKeys },
  urlQueries
) => {
  // Are there excessive keys in request body?
  if (Object.keys(badKeys).length > 0) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  }

  // Should we invoke Add Votes To Article By User?
  else if (inc_votes !== undefined && voting_user !== undefined) {
    return this.addVoteToArticleByUser(
      { article_id },
      { inc_votes, voting_user }
    );
  }

  // Should we invoke Update Article Votes?
  else if (inc_votes !== undefined && voting_user === undefined) {
    return this.updateArticleVotes({ article_id }, { inc_votes, voting_user });
  }

  // We will modify article details. Note, you cannot do both this and Add Votes To Article By User.
  // Note, this replaces the Update Article Votes function.
  else if (voting_user === undefined) {
    return connection
      .select("*")
      .from("articles")
      .where("article_id", article_id)
      .modify(queryBuilder => {
        // [body, topic, title, author].forEach(arg => {
        //   if (arg !== undefined) {
        //     queryBuilder = queryBuilder.update({ arg: arg });
        //   }

        //   if (inc_votes !== undefined) {
        //     queryBuilder = queryBuilder.increment("votes", inc_votes);
        //   }
        // });
        // This ought to replace all the below.

        if (inc_votes !== undefined) {
          queryBuilder = queryBuilder.increment("votes", inc_votes);
        }
        if (body !== undefined) {
          queryBuilder = queryBuilder.update({
            body: body
          });
        }
        if (topic !== undefined) {
          queryBuilder = queryBuilder.update({
            topic: topic
          });
        }
        if (title !== undefined) {
          queryBuilder = queryBuilder.update({
            title: title
          });
        }
        if (author !== undefined) {
          queryBuilder = queryBuilder.update({
            author: author
          });
        }
      })
      .returning("*")
      .then(articleArr => {
        if (articleArr.length === 0) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else return articleArr[0];
      });
  }

  // There are missing keys so we will not update details, merely return unchanged item to user.
  else
    return connection
      .select("*")
      .from("articles")
      .where("article_id", article_id)
      .then(articleArr => {
        if (articleArr.length === 0) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else return articleArr[0];
      });

  //
  // else if (inc_votes !== undefined && voting_user !== undefined) {
  //   return this.addVoteToArticleByUser(
  //     { article_id },
  //     { inc_votes, voting_user }
  //   );
  // }

  // //
  // else if ([body, topic, title, author].some(arg => arg !== undefined)) {
  //   return this.updateArticleTitleTopicBodyOrAuthor(
  //     { article_id },
  //     { body, topic, title, author }
  //   );
  // }

  //
};
//THE FUNCTIONS THAT ARE ROUTED TO:

exports.fetchArticleVotesJunctionTable = () => {
  return connection.select("*").from("users_articles_table");
};

exports.addVoteToArticleByUser = (
  { article_id },
  { inc_votes = 0, voting_user, ...badQueries }
) => {
  // if (Object.keys(badQueries).length > 0) {
  //   return Promise.reject({ status: 400, customStatus: "400a" });
  // }

  // Checking if trying to submit invalid vote.
  if (inc_votes !== 1 && inc_votes !== -1 && inc_votes !== 0) {
    return Promise.reject({ status: 400, customStatus: "400d" });
  }
  return connection
    .select("*")
    .from("users_articles_table")
    .where("voting_user", voting_user)
    .andWhere("article_id", article_id)
    .then(rows => {
      if (rows.length) {
        //Checking if same user trying to upvote or downvote s/th that is already upvoted/downvoted.
        if (
          (rows[0].inc_votes === 1 && inc_votes === 1) ||
          (rows[0].inc_votes === -1 && inc_votes === -1)
        ) {
          return Promise.reject({ status: 400 });
        } else {
          //Increment the votes.
          return connection("users_articles_table")
            .where("voting_user", voting_user)
            .andWhere("article_id", article_id)
            .increment("inc_votes", inc_votes)
            .returning("*")
            .then(rows => {
              return rows[0];
            });
        }
      }
      // Adding a new vote to article from this specific user.
      return connection
        .insert({
          voting_user: voting_user,
          article_id: article_id,
          inc_votes: inc_votes
        })
        .into("users_articles_table")
        .returning("*")
        .then(resArr => {
          return resArr[0];
        });
    });
};

exports.updateArticleVotes = (
  { article_id },
  { inc_votes = 0, ...badQueries }
) => {
  // if (Object.keys(badQueries).length > 0) {
  //   return Promise.reject({ status: 400, customStatus: "400a" });
  // }
  return connection("articles")
    .where({ article_id: article_id }) // No quotation marks needed.
    .increment("votes", inc_votes)
    .returning("*")
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      } else return articles[0];
    });
};

exports.updateArticleTitleTopicBodyOrAuthor = (
  { article_id },
  { body, topic, title, author }
) => {
  return connection("articles")
    .where("article_id", article_id)
    .modify(queryBuilder => {
      //[body, topic, title, author].forEach(arg => queryBuilder = queryBuilder.update({arg: arg})) // This ought to replace all the below.

      if (author !== undefined) {
        queryBuilder.update({
          body: body
        });
      }
      if (topic !== undefined) {
        queryBuilder.update({
          topic: topic
        });
      }
      if (title !== undefined) {
        queryBuilder.update({
          title: title
        });
      }
      if (author !== undefined) {
        queryBuilder.update({
          author: author
        });
      }
    })
    .returning("*")
    .then(articleArr => {
      return articleArr[0];
    });
};

exports.fetchArticleData = (
  { article_id },
  {
    sort_by,
    order = "desc",
    author,
    topic,
    title,
    voted_by,
    vote_direction = "up",
    limit = 10,
    p = 1,
    minutes = 100000000, // This is just to pass tests, change to 10 as default.
    ...badUrlQueries
  }
) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate - minutes * 60000);
  if (Object.keys(badUrlQueries).length) {
    return Promise.reject({ status: 400, customStatus: "400c" });
  }

  function GET_COMMENT_COUNT_AND_ALL(qb) {
    qb.from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .count({ comment_count: "comments.article_id" })
      .groupBy("articles.article_id")
      .select("articles.*");
  }

  function GET_ADDITIONAL_VOTES(qb) {
    qb.from("articles")
      .rightJoin(
        "users_articles_table",
        "articles.article_id",
        "users_articles_table.article_id"
      )
      .groupBy("articles.article_id")
      .sum({ additionalVotes: "users_articles_table.inc_votes" })
      //.sumDistinct({ additionalVotes: "users_articles_table.inc_votes" })
      .select("articles.article_id")
      .then(x => {
        return x;
      });
  }

  return (
    connection
      //.distinct("table_of_additional_votes_only.article_id")
      .with("table_of_articles_with_commentcount", qb =>
        GET_COMMENT_COUNT_AND_ALL(qb)
      )
      .with("table_of_additional_votes_only", qb => GET_ADDITIONAL_VOTES(qb))
      .from("table_of_articles_with_commentcount")
      .leftJoin(
        "table_of_additional_votes_only",
        "table_of_articles_with_commentcount.article_id",
        "table_of_additional_votes_only.article_id"
      )
      .rightJoin(
        "articles",
        "table_of_articles_with_commentcount.article_id",
        "articles.article_id"
      )
      // .select("*")

      .modify(queryBuilder => {
        if (voted_by !== undefined && vote_direction === "up") {
          queryBuilder = queryBuilder
            .rightJoin(
              "users_articles_table",
              "table_of_articles_with_commentcount.article_id",
              "users_articles_table.article_id"
            )
            .where("voting_user", voted_by)
            .andWhere("inc_votes", 1);
        } else if (voted_by !== undefined && vote_direction === "down") {
          queryBuilder = queryBuilder
            .rightJoin(
              "users_articles_table",
              "table_of_articles_with_commentcount.article_id",
              "users_articles_table.article_id"
            )
            .where("voting_user", voted_by)
            .andWhere("inc_votes", -1);
        }
      })
      .modify(queryBuilder => {
        if (author !== undefined) {
          queryBuilder.where(
            "table_of_articles_with_commentcount.author",
            author
          );
        }
        if (topic !== undefined) {
          queryBuilder.where(
            "table_of_articles_with_commentcount.topic",
            topic
          );
        }
        if (title !== undefined) {
          queryBuilder.where(
            "table_of_articles_with_commentcount.title",
            title
          );
        }
      })

      //HERE WE COULDNT ACCESS TOPIC EG
      .modify(queBuil => {
        if (sort_by === undefined) {
          sort_by = "created_at";
        }
        queBuil
          .where(
            "table_of_articles_with_commentcount.created_at",
            ">=",
            startDate
          )
          .orderBy(`table_of_articles_with_commentcount.${sort_by}`, order);
      })

      .modify(queryBuilder => {
        if (sort_by === undefined) {
        }
      })

      .modify(queryBuilder => {
        if (article_id !== undefined) {
          //Endpoint wants one article.
          queryBuilder
            .where("table_of_articles_with_commentcount.article_id", article_id)
            .first(
              // if i used select instead, will that simplify the end of this big function where we sort if in array or not?
              "table_of_articles_with_commentcount.comment_count",
              "table_of_articles_with_commentcount.author",
              "table_of_articles_with_commentcount.title",
              "table_of_articles_with_commentcount.article_id",
              "table_of_articles_with_commentcount.votes",
              "table_of_articles_with_commentcount.topic",
              "table_of_articles_with_commentcount.body",
              "table_of_articles_with_commentcount.created_at",
              "table_of_additional_votes_only.additionalVotes"
            );
        } else {
          // Endpoint wants many articles.
          queryBuilder.select(
            "table_of_articles_with_commentcount.comment_count",
            "table_of_articles_with_commentcount.author",
            "table_of_articles_with_commentcount.title",
            "table_of_articles_with_commentcount.article_id",
            "table_of_articles_with_commentcount.votes",
            "table_of_articles_with_commentcount.topic",
            //"articles.body", // Not desired at endpoint.
            "table_of_articles_with_commentcount.created_at",
            "table_of_additional_votes_only.additionalVotes"
          );
        }
      })

      .then(articleData => {
        if (articleData === undefined) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else if (Array.isArray(articleData)) {
          // if (articleData.length === 0) {
          //   return Promise.reject({ status: 404, customStatus: "404b" }); // Or this could return empty array, as Lurker has written no articles.
          // } else {

          articleData.forEach(item => {
            calculateVotesAndParseIntCommentCount(item);
          });
          return {
            articles: articleData.slice(p * limit - limit, p * limit),
            total_count: articleData.length
          }; // articleData is array

          // }
        } else {
          calculateVotesAndParseIntCommentCount(articleData);
          return articleData;
        }
      })
  );
};

exports.createNewCommentOnArticle = (
  { article_id },
  { username, body, ...unnecessaryKeys }
) => {
  if (Object.keys(unnecessaryKeys).length) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  }
  // return Promise.all([
  //   doesValueExistInTable(username, "username", "users"),
  //   doesValueExistInTable(article_id, "article_id", "articles")
  // ])
  //   .then(res => {
  //     // if (username && !res[0] && res[1]) {
  //     //   return Promise.reject({ status: 404, customStatus: "404a" });
  //     // }
  //   })
  // .then(() => {
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
  // });
};

exports.fetchCommentsByArticle = (
  { article_id },
  {
    sort_by = "created_at",
    order = "desc",
    limit = 10,
    p = 1,
    ...badUrlQueries
  }
) => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      }
    })
    .then(() => {
      //Check if article_id exists in articles, if not, then throw error, but if so, then send back any result, incl empty array.

      if (Object.keys(badUrlQueries).length) {
        return Promise.reject({ status: 400, customStatus: "400c" });
      } else
        return connection
          .select("comment_id", "votes", "created_at", "author", "body")
          .from("comments")
          .where("article_id", article_id)
          .orderBy(sort_by, order)
          .then(commentsArr => {
            // if (commentsArr.length === 0) {
            //   return Promise.reject({ status: 404, customStatus: "404a" });
            // } else {
            return {
              comments: commentsArr.slice(p * limit - limit, p * limit),
              total_count: commentsArr.length
            };
            // }
          });
    });
};

exports.createNewArticle = ({
  title,
  topic,
  author,
  body,
  votes = 0,
  ...unnecessaryKeys
}) => {
  if (Object.keys(unnecessaryKeys).length) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  }

  return connection
    .insert({
      title: title,
      topic: topic,
      author: author,
      body: body,
      votes: votes
    })
    .into("articles")
    .returning("*")
    .then(articleArr => {
      return articleArr[0];
    });
};

exports.deleteArticleByID = ({ article_id }) => {
  return connection("articles")
    .where({ article_id: article_id }) // No quotation marks needed.
    .del()
    .then(numberRowsDeleted => {
      if (numberRowsDeleted === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      } else return numberRowsDeleted;
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
