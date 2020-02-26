const connection = require("../db/connection");

exports.doesValueExistInTable = (value = null, column, table) => {
  return connection
    .select("*")
    .from(table)
    .where(column, value)
    .then(result => {
      if (result.length > 0) {
        return true;
      } else return false;
    });
};
