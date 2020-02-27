const connection = require(".././connection");

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

exports.formatDates = list => {
  let listCopy = []; // Refactored to have non-ref copying of the objects inside too.
  list.forEach(item => listCopy.push({ ...item }));

  listCopy.forEach(item => {
    item.created_at = new Date(item.created_at);
  });
  return listCopy;
};

exports.makeRefObj = (arr, param1, param2) => {
  let referenceObj = {};
  for (let i = 0; i < arr.length; i++) {
    referenceObj[arr[i][param1]] = arr[i][param2];
  }
  return referenceObj;
};

/*

 */

exports.formatComments = (comments, articleRef) => {
  let commentsCopy = []; // Refactored to have non-ref copying of the objects inside too.
  comments.forEach(comment => commentsCopy.push({ ...comment }));

  for (let i = 0; i < commentsCopy.length; i++) {
    commentsCopy[i].author = commentsCopy[i].created_by;
    delete commentsCopy[i].created_by;

    commentsCopy[i].article_id = articleRef[commentsCopy[i].belongs_to];
    delete commentsCopy[i].belongs_to;

    commentsCopy[i].created_at = new Date(commentsCopy[i].created_at);
  }

  return commentsCopy;
};

// const switchOutKeys = (data, refObj, oldKey, newquay) => {
// 	let modifiedData = [...data]
// 	modifiedData.forEach(item => {
// 		item[newquay] = refObj[item[oldKey]];
// 		delete item[oldKey];
// 	})
// 	return modifiedData
// 	}
