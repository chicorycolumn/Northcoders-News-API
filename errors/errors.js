exports.myErrMsgs = {

'400a': '400a Bad request: Missing/incorrect fields in body of request, eg POST.',
'400aa': '400aa Bad request: Re the fields in body of request, likely you entered wrong data type eg {age: "banana"}',
'400b': '400b Bad request: The url may have an invalid indentifier.',
'400c': '400c Bad request: At least one query in the url is invalid.',

'404a': '404a No such resource: Likely a valid but non-corresponding identifier in the url.',
'404b': '404b No such resource: Nothing in our database fits your specifications.'

}

const myErrMsgs = exports.myErrMsgs

exports.pSQLErrorsHandler = (err, req, res, next) => {

    if (err.code === '22P02' && err.toString().split(" ").slice(-1)[0] === '"NaN"'){
        res.status(400).send({ msg: myErrMsgs['400aa'] })
    }
    
    const errCodes = {

        '42703': { status: 400, msg: myErrMsgs['400c'] }, // empty obj
        //User tried to filter by a nonexistent column, in the url query.
        
        '23502': { status: 400, msg: myErrMsgs['400a'] }, // null
        //User entered empty object for POST request.
        //User entered object with wrong keys for POST request.
        
        'my-custom-code-400a': { status: 400, msg: myErrMsgs['400a'] },
        //User entered empty object for PATCH request.
        //User entered object with wrong keys for POST request.
        
        '22P02': { status: 400, msg: myErrMsgs['400b'] } 
        //User entered banana as :article_id .
        
        
        /* This was for url id of "banana" instead of number, 
        but also for age key in post having value "banana" not number. 
        Is that too broad a category for this message to cover? */

        //'22P02': { status: 400, msg: '22P02 Invalid route: url or id not valid' } // string not num eg
    };
    if (err.code !== undefined) {
        res.status(errCodes[err.code].status).send({ msg: errCodes[err.code].msg });
    } else next(err)
};


exports.handleCustomErrors = (err, req, res, next) => { // handles status, custom erors, that iv'e written

    if (err.status !== undefined) {

        if (err.status === 404){res.status(404).send({msg: myErrMsgs['404a']})}
        
        else res.status(err.status).send({ msg: err.msg })
    
    } else next(err)
}

exports.handle405s = (req, res, next) => {
    res.status(405).send({ msg: 'Method not allowed, my friend' })
}

exports.handle404s = (req, res, next) => {
    res.status(404).send({ msg: 'Route does not exist my friend' })
}