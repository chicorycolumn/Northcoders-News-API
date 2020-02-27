const connection = require("../db/connection.js");

exports.updateCommentVotes = (
  { comment_id },
  { inc_votes = 0, ...badQueries }
) => {
  if (Object.keys(badQueries).length > 0) {
    return Promise.reject({ status: 400, customStatus: "400a" });
  } else
    return connection("comments")
      .where({ comment_id: comment_id })
      .increment("votes", inc_votes)
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
