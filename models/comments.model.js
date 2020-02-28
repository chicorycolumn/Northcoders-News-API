const connection = require("../db/connection.js");

exports.fetchCommentByID = ({ comment_id }) => {
  return connection("comments")
    .select("*")
    .where({ comment_id: comment_id })
    .then(commentArr => {
      if (commentArr.length === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      } else {
        return commentArr[0];
      }
    });
};

exports.updateCommentDetails = (
  { comment_id },
  { inc_votes, body, ...badKeys },
  queries
) => {
  if (Object.keys(badKeys).length > 0) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  } else
    return connection("comments")
      .where({ comment_id: comment_id })
      .modify(queryBuilder => {
        if (inc_votes !== undefined) {
          queryBuilder = queryBuilder.increment("votes", inc_votes);
        }
      })
      .modify(queryBuilder => {
        if (body !== undefined) {
          queryBuilder = queryBuilder.update({
            body: body
          });
        }
      })
      .returning("*")
      .then(comments => {
        if (comments.length === 0) {
          return Promise.reject({ status: 404, customStatus: "404a" });
        } else return comments[0];
      });
};

exports.deleteCommentByID = ({ comment_id }) => {
  return connection("comments")
    .where({ comment_id: comment_id })
    .del()
    .then(numberRowsDeleted => {
      if (numberRowsDeleted === 0) {
        return Promise.reject({ status: 404, customStatus: "404a" });
      } else return numberRowsDeleted;
    });
};
