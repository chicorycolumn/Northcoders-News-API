exports.formatDates = list => {
    return list.map(comment => comment.created_at = new Date(comment.created_at))
};

exports.makeRefObj = (list) => {
	let referenceObj = {}
	for (let i = 0; i < arr.length; i++){
		referenceObj[ arr[i][title] ] = arr[i][article_id]
	}
	return referenceObj
}

exports.formatComments = (comments, articleRef) => {};
