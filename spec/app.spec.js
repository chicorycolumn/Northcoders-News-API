process.env.NODE_ENV = "test"
const connection = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const chai = require("chai")
const { expect } = require('chai')
chai.use(require("sams-chai-sorted"))
const {myErrMsgs} = require('../errors/errors')


describe('/api', () => {
    after(() => {
        connection.destroy()
    })
    beforeEach(() => {
        return connection.seed.run() // knex looks in the knexfile to find seed file, and the former contains a link to it.
    })

    describe('/topics', () => {
        it('GET 200 returns array of all topics, with slug and description.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(res => {
                expect(res.body.topics).to.be.an('Array')
                res.body.topics.forEach(topic => expect(topic).to.have.all.keys(['slug', 'description']))
            })
        })
    })
    describe('/users/:username', () => {
        it('GET 200 returns user by ID, which has username, avatar_url, and name.', () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(res => {
                expect(res.body.user).to.be.an('Array')
                expect(res.body.user[0]).to.have.all.keys(['username', 'avatar_url', 'name'])
                expect(res.body.user[0].avatar_url).to.equal('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
            })
        })
                // **************
                // Error Handling
                // **************
        it('GET 404 returns error if non-existent username.', () => {
            return request(app)
            .get('/api/users/NON_EXISTENT_ID')
            .expect(404)
            .then(res => {
                expect(res.body.msg).to.equal(myErrMsgs["404a"])
            })
        })
    })

    describe('/articles', () => {
        xit('GET 200 returns an articles array of article objects, each of which has all the keys, BUT with body key excluded, AND with comment_count key added, sorted by date desc default.', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(res => {
                expect(res.body.articles).to.be.an('Array')
                res.body.articles.forEach(article => expect(article).to.have.all.keys(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']))
                expect(res.body.articles).to.be.sortedBy('date', { descending: true })
            })      
        })
        xit('GET 200 author is username from the users table.', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(res => {
                expect(res.body.articles[0].author).to.equal('')
            })      
        })
        xit('GET 200 comment_count is the total count of all the comments with this article.', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(res => {
                expect(res.body.articles[0].comment_count).to.equal('')
            })      
        })
        xit('GET 200 returns an `articles` array sorted by any valid column.', () => {
            return request(app)
            .get('/api/articles?sort_by=topic')
            .expect(200)
            .then(res => {
                expect(res.body.articles).to.be.an('Array')
                res.body.articles.forEach(article => expect(article).to.have.all.keys(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']))
                expect(res.body.articles).to.be.sortedBy('topic', { descending: true })
            })      
        })
        xit('GET 200 returns an `articles` array sorted by any valid column with order specifiable.', () => {
            return request(app)
            .get('/api/articles?sort_by=votes&order=asc')
            .expect(200)
            .then(res => {
                expect(res.body.articles).to.be.an('Array')
                res.body.articles.forEach(article => expect(article).to.have.all.keys(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']))
                expect(res.body.articles).to.be.sortedBy('votes', { descending: false })
            })      
        })
        xit('GET 200 returns an `articles` array filtered by author.', () => {
            return request(app)
            .get('/api/articles?author=icellusedkars')
            .expect(200)
            .then(res => {
                expect(res.body.articles).to.be.an('Array')
                res.body.articles.forEach(article => expect(article).to.have.all.keys(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']))
                expect(res.body.articles).to.be.sortedBy('date', { descending: true })
                res.body.articles.forEach(article => expect(article.author).to.equal('icellusedkars'))
                expect(res.body.articles.length).to.equal(6)
            })          
        })
        xit('GET 200 returns an `articles` array filtered by topic.', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(res => {
                expect(res.body.articles).to.be.an('Array')
                res.body.articles.forEach(article => expect(article).to.have.all.keys(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']))
                res.body.articles.forEach(article => expect(article.topic).to.equal('mitch'))
                expect(res.body.articles).to.be.sortedBy('date', { descending: true })
                expect(res.body.articles.length).to.equal(11)
            })      
        })
                // **************
                // Error Handling
                // **************
        xit('GET 404 returns error if nothing matches that ?query.', () => {
            return request(app)
            .get('/api/articles?topic=NON_EXISTENT_TOPIC')
            .expect(404)
            .then(res => {
                expect(res.body.msg).to.equal(myErrMsgs['404b'])
            })      
        })
        xit('GET 400 returns error if invalid or nonexistent ?query in url.', () => {
            return request(app)
            .get('/api/articles?topic=NON_EXISTENT_TOPIC')
            .expect(400)
            .then(res => {
                expect(res.body.msg).to.equal(myErrMsgs['400c'])
            })      
        })

        describe('/article:id', () => {
            
            // returns an article object, which should have the following properties:
            // - `author` which is the `username` from the users table
            // - `title`
            // - `article_id`
            // - `body`
            // - `topic`
            // - `created_at`
            // - `votes`
            // - `comment_count` which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this

            it.only('GET 200 returns article by id, with the right properties, including comment_count.', () => {
                return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(res => {
                    expect(res.body.article[0]).to.be.an('Object')
                    expect(res.body.article[0]).to.have.all.keys(['author', 'title', 'article_id', 'body', 'created_at', 'votes', 'comment_count'])
                }) 
            })
            
            
            
            describe('/comments', () => {
                it('GET 200 comments by article ID, each of which have all right keys, and are sorted by created_at descending default.', () => {
                    return request(app)
                    .get('/api/articles/5/comments')
                    .expect(200)
                    .then(res => {
                        expect(res.body.comments).to.be.an('Array')
                        res.body.comments.forEach(comment => expect(comment).to.have.all.keys(['comment_id', 'votes', 'created_at', 'author', 'body']))
                        expect(res.body.comments).to.be.sortedBy('created_at', { descending: true })
                    }) 
                })
                it('GET 200 comments by article ID, where author is the username from users table.', () => {
                    return request(app)
                    .get('/api/articles/5/comments')
                    .expect(200)
                    .then(res => {
                        expect(res.body.comments[0].author).to.equal('icellusedkars')
                    }) 
                })
                it('GET 200 comments by article ID, sorted by any column, descending default.', () => {
                    return request(app)
                    .get('/api/articles/5/comments?sort_by=votes')
                    .expect(200)
                    .then(res => {
                        expect(res.body.comments).to.be.sortedBy('votes', { descending: true })
                    }) 
                })
                it('GET 200 comments by article ID, sorted by any column, ascending can be specified.', () => {
                    return request(app)
                    .get('/api/articles/5/comments?sort_by=author&order=asc')
                    .expect(200)
                    .then(res => {
                        expect(res.body.comments).to.be.sortedBy('author', { descending: false })
                    }) 
                })
                // **************
                // Error Handling
                // **************
                it('GET 400 if invalid url query.', () => {
                    return request(app)
                    .get('/api/articles/5/comments?sort_by=aaaaaaaaaauthor')
                    .expect(400)
                    .then(res => {
                        expect(res.body.msg).to.equal(myErrMsgs['400c'])
                    }) 
                })
                it('GET 404 if id valid but nonexistent.', () => {
                    return request(app)
                    .get('/api/articles/6666/comments?sort_by=author&order=asc')
                    .expect(404)
                    .then(res => {
                        expect(res.body.msg).to.equal(myErrMsgs['404a'])
                    }) 
                })
                it('GET 400 if invalid id.', () => {
                    return request(app)
                    .get('/api/articles/INVALID_ID/comments?sort_by=author&order=asc')
                    .expect(400)
                    .then(res => {
                        expect(res.body.msg).to.equal(myErrMsgs['400b'])
                    }) 
                })

                it('POST 201 responds with created comment.', () => {
                    return request(app)
                    .post('/api/articles/5/comments')
                    .send({username: "Genghis", body: "Not enough pillaging"})
                    .expect(201)
                    .then(res => {
                        delete res.body.comment[0].created_at
                        expect(res.body.comment[0]).to.eql({
                            comment_id: 19,
                            author: 'Genghis',
                            article_id: 5,
                            votes: 0,
                            //created_at: '2020-02-25T14:23:37.689Z',
                            body: 'Not enough pillaging'
                        })
                    })
                })

                // **************
                // Error Handling
                // **************

                it('POST: 400 responds with error when missing fields', () => {
                    return request(app)
                    .post('/api/articles/5/comments')
                        .send({  })
                        .expect(400)
                        .then(res => {
                            expect(res.body.msg).to.eql(myErrMsgs['400a'])
                        })
                });
        
                it('POST: 400 responds with error failing schema validation', () => {
                    return request(app)
                    .post('/api/articles/5/comments')
                        .send({usernameeeeeeeeeeeeeeeeee: "Genghis", body: "Not enough pillaging"})
                        .expect(400)
                        .then(res => {
                            expect(res.body.msg).to.equal(myErrMsgs['400a'])
                        })
                });
                it('POST 404 if id valid but nonexistent.', () => {
                    return request(app)
                    .post('/api/articles/6666/comments')
                    .send({username: "Genghis", body: "Not enough pillaging"})
                    .expect(404)
                    .then(res => {
                        expect(res.body.msg).to.equal(myErrMsgs['404a'])
                    }) 
                })
                it('POST 400 if invalid id.', () => {
                    return request(app)
                    .post('/api/articles/INVALID_ID/comments')
                    .send({username: "Genghis", body: "Not enough pillaging"})
                    .expect(400)
                    .then(res => {
                        expect(res.body.msg).to.equal(myErrMsgs['400b'])
                    }) 
                })
                // it('POST 400 if key in body of request is given wrong value type.', () => {
                //     return request(app)
                //     .post('/api/articles/5/comments')
                //     .send({username: "Genghis", body: "Not enough pillaging"})
                //     .expect(404)
                //     .then(res => {
                //         expect(res.body.msg).to.equal(myErrMsgs['404a'])
                //     }) 
                // })
            })
        })
    })
})


















// - an `articles` array of article objects, each of which should have the following properties:
//   - `author` which is the `username` from the users table
//   - `title`
//   - `article_id`
//   - `topic`
//   - `created_at`
//   - `votes`
//   - `comment_count` which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this

// #### Should accept queries

// - `sort_by`, which sorts the articles by any valid column (defaults to date)
// - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
// - `author`, which filters the articles by the username value specified in the query
// - `topic`, which filters the articles by the topic value specified in the query
