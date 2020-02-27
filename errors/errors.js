exports.myErrMsgs = {
  "400": "400 Bad request: Generic error message.",
  "400a":
    "400a Bad request: Missing/incorrect fields in body of request, eg POST.",
  "400b":
    "400b Bad request: The url may have an invalid indentifier. Alternately, if this is a POST request, you may have bad data type in request.",
  "400c": "400c Bad request: At least one query in the url is invalid.",
  "400d":
    '400d Bad request: Re the fields in body of request, likely you entered wrong data type eg {age: "banana"}, or a number outside range.',
  "400e":
    "400e Bad request: Re the fields in body of request, there was some schema error, such as you entering too many characters for a field.",

  "404": "404 No such resource: You may have mistyped the url.",
  "404a":
    "404a No such resource: Likely a valid but non-corresponding identifier in the url.",
  "404b":
    "404b No such resource: Nothing in our database fits your specifications.",
  "404c":
    "404c No such resource: You may be specified a non-existent value in the body of your request.",

  "405":
    "405 Method not allowed: You cannot make such a request (eg DELETE, POST, GET, etc) at this particular endpoint. You may have spelled the url wrong."
};

const myErrMsgs = exports.myErrMsgs;

exports.pSQLErrorsHandler = (err, req, res, next) => {
  const wordsFromError = err.toString().split(" ");

  if (err.code === "22P02" && wordsFromError.slice(-1)[0] === '"NaN"') {
    res.status(400).send({ msg: myErrMsgs["400d"] });
  }

  const errCodes = {
    "42703": { status: 400, msg: myErrMsgs["400c"] }, // empty obj
    //User tried to filter by a nonexistent column, in the url query.

    "23503": { status: 404, msg: myErrMsgs["404c"] }, // null
    //User entered POST request with a key referencing an author/topic/etc that doesn't exist.

    "23502": { status: 400, msg: myErrMsgs["400a"] }, // null
    //User entered empty object for POST request.
    //User entered object with wrong keys for POST request.

    "22P02": { status: 400, msg: myErrMsgs["400b"] },
    //User entered banana as :article_id .

    "22001": { status: 400, msg: myErrMsgs["400e"] }
    //User entered over 2000 chars for body of article in POST req .

    /* This was for url id of "banana" instead of number, 
        but also for age key in post having value "banana" not number. 
        Is that too broad a category for this message to cover? */

    //'22P02': { status: 400, msg: '22P02 Invalid route: url or id not valid' } // string not num eg
  };
  if (err.code !== undefined) {
    res.status(errCodes[err.code].status).send({ msg: errCodes[err.code].msg });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  // handles status, custom erors, that iv'e written

  if (err.status !== undefined) {
    if (err.customStatus !== undefined) {
      res.status(err.status).send({ msg: myErrMsgs[err.customStatus] });
    } else res.status(err.status).send({ msg: myErrMsgs[err.status] });
  } else next(err);
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: myErrMsgs["405"] });
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: myErrMsgs["404"] });
};
