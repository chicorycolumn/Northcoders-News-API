process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = require("chai");
chai.use(require("sams-chai-sorted"));
const { myErrMsgs } = require("../errors/errors");
const endpointsCopy = require("../endpoints.json");

describe("/api", () => {
  after(() => {
    connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run(); // knex looks in the knexfile to find seed file, and the former contains a link to it.
  });

  describe("/", () => {
    it("Serves up endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(res => {
          expect(res.body.endpoints).to.be.an("Object");
          expect(res.body.endpoints).to.eql(endpointsCopy);
        });
    });
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api";
      return Promise.all([
        request(app).del(url),
        request(app).patch(url),
        request(app).post(url)
      ]).then(resArr => {
        resArr.forEach(response => {
          expect(405);
          expect(response.body.msg).to.equal(myErrMsgs["405"]);
        });
      });
    });
  });

  describe("/topics", () => {
    it("**POST 201 responds with created topic.", () => {
      return request(app)
        .post("/api/topics")
        .send({
          description: "the smell of a mown lawn",
          slug: "grass"
        })
        .expect(201)
        .then(res => {
          expect(res.body.topic).to.have.all.keys(["description", "slug"]);
          expect(res.body.topic.description).to.equal(
            "the smell of a mown lawn"
          );
          expect(res.body.topic.slug).to.equal("grass");
        });
    });

    it("**POST: 400a responds with error when missing fields", () => {
      return request(app)
        .post("/api/topics")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["400a"]);
        });
    });

    it("**POST: 400a responds with error when failing schema validation", () => {
      return request(app)
        .post("/api/topics")
        .send({
          descriptionnnnnnnnnnnnnnnnnnnnnnn: "the smell of a mown lawn",
          slug: "grass"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("**POST: 400e responds with error when failing schema validation due to too long field", () => {
      return request(app)
        .post("/api/topics")
        .send({
          description: "the smell of a mown lawn",
          slug:
            "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400e"]);
        });
    });
    it("**POST 400a returns error when request contains other values.", () => {
      return request(app)
        .post("/api/topics")
        .send({
          description: "the smell of a mown lawn",
          slug: "grass",
          unnecessaryKey: "NO_NEED_FOR_THIS"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("**Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/topics";
      return Promise.all([request(app).del(url), request(app).patch(url)]).then(
        resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        }
      );
    });

    //Topics endpoint does not currently accept queries.
    // it.only("##GET 200 returns an array of topic objects, limited to 10 items by default, starting page 1 by default", () => {
    //   return request(app)
    //     .get("/api/topics")
    //     .expect(200)
    //     .then(res => {
    //       expect(res.body.topics).to.be.an("Array");
    //       expect(res.body.topics.length).to.equal(10);
    //       expect(res.body.total_count).to.equal(13);
    //     });
    // });

    // it.only("##GET 200 returns an array of topic objects, page and limit specifiable", () => {
    //   return request(app)
    //     .get("/api/topics?limit=6")
    //     .expect(200)
    //     .then(res => {
    //       expect(res.body.topics).to.be.an("Array");
    //       expect(res.body.topics.length).to.equal(6);
    //       expect(res.body.total_count).to.equal(13);
    //     });
    // });

    // it.only("##GET 200 returns an array of comment objects, page and limit specifiable", () => {
    //   return request(app)
    //     .get("/api/topics?limit=6&p=1")
    //     .expect(200)
    //     .then(firstSixTopics => {
    //       return request(app)
    //         .get("/api/topics?limit=3&p=2")
    //         .expect(200)
    //         .then(secondThreeTopics => {
    //           expect(secondThreeTopics.body.topics).to.be.an("Array");
    //           expect(secondThreeTopics.body.topics.length).to.equal(3);
    //           expect(secondThreeTopics.body.total_count).to.equal(13);
    //           expect(firstSixTopics.body.topics.slice(3, 6)).to.eql(
    //             secondThreeTopics.body.topics
    //           );
    //         });
    //     });
    // });

    it("GET 200 returns array of all topics, with slug and description.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("Array");
          res.body.topics.forEach(topic =>
            expect(topic).to.have.all.keys(["slug", "description"])
          );
        });
    });
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/topics";
      return Promise.all([request(app).del(url), request(app).patch(url)]).then(
        resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        }
      );
    });
  });
  describe("/users", () => {
    it("**POST 201 responds with created user.", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "queen",
          avatar_url: "www.ask.com/crown.png",
          name: "lena"
        })
        .expect(201)
        .then(res => {
          expect(res.body.user).to.have.all.keys([
            "username",
            "avatar_url",
            "name"
          ]);
          expect(res.body.user.name).to.equal("lena");
          expect(res.body.user.avatar_url).to.equal("www.ask.com/crown.png");
          expect(res.body.user.username).to.equal("queen");
        });
    });

    it("**POST: 400a responds with error when missing fields", () => {
      return request(app)
        .post("/api/users")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["400a"]);
        });
    });

    it("**POST: 400a responds with error when failing schema validation", () => {
      return request(app)
        .post("/api/users")
        .send({
          usernameeeeeeeeeeeeeeeeeee: "queen",
          avatar_url: "www.ask.com/crown.png",
          name: "lena"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("**POST: 400e responds with error when failing schema validation due to too long field", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "queen",
          avatar_url: "www.ask.com/crown.png",
          name:
            "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400e"]);
        });
    });
    it("**POST 400a returns error when request contains other values.", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "queen",
          avatar_url: "www.ask.com/crown.png",
          name: "lena",
          unnecessaryKey: "NO_NEED_FOR_THIS_RUBBISH"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });

    it("**GET 200 returns array of all users.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(res => {
          expect(res.body.users).to.be.an("Array");
          res.body.users.forEach(user =>
            expect(user).to.have.all.keys(["username", "avatar_url", "name"])
          );
        });
    });
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/users";
      return Promise.all([request(app).del(url), request(app).patch(url)]).then(
        resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        }
      );
    });

    describe("/:username", () => {
      it("GET 200 returns user by ID, which has username, avatar_url, and name.", () => {
        return request(app)
          .get("/api/users/lurker")
          .expect(200)
          .then(res => {
            expect(res.body.user).to.be.an("Object");
            expect(res.body.user).to.have.all.keys([
              "username",
              "avatar_url",
              "name"
            ]);
            expect(res.body.user.avatar_url).to.equal(
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            );
          });
      });
      it("GET 404a returns error if non-existent username.", () => {
        return request(app)
          .get("/api/users/NON_EXISTENT_ID")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
    });
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/users/:username";
      return Promise.all([
        request(app).del(url),
        request(app).patch(url),
        request(app).post(url)
      ]).then(resArr => {
        resArr.forEach(response => {
          expect(405);
          expect(response.body.msg).to.equal(myErrMsgs["405"]);
        });
      });
    });
  });
  describe("/articles", () => {
    it("##GET 200 returns an array of article objects, limited to 10 items by default, starting page 1 by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          expect(res.body.articles.length).to.equal(10);
          expect(res.body.total_count).to.equal(12);
        });
    });

    it("##GET 200 returns an array of article objects, page and limit specifiable", () => {
      return request(app)
        .get("/api/articles?limit=6")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          expect(res.body.articles.length).to.equal(6);
          expect(res.body.total_count).to.equal(12);
        });
    });

    it("##GET 200 returns an array of article objects, page and limit specifiable", () => {
      return request(app)
        .get("/api/articles?limit=6&p=1")
        .expect(200)
        .then(firstSixArticles => {
          return request(app)
            .get("/api/articles?limit=3&p=2")
            .expect(200)
            .then(secondThreeArticles => {
              expect(secondThreeArticles.body.articles).to.be.an("Array");
              expect(secondThreeArticles.body.articles.length).to.equal(3);
              expect(secondThreeArticles.body.total_count).to.equal(12);
              expect(firstSixArticles.body.articles.slice(3, 6)).to.eql(
                secondThreeArticles.body.articles
              );
            });
        });
    });

    it("GET 200 returns an array of article objects, each having all the keys, BUT with body key excluded, AND with comment_count key added, sorted by created_at in descending by default.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET 200 author is username from the users table.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].author).to.equal("butter_bridge");
        });
    });
    it("GET 200 comment_count is the total count of all the comments with each article.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].comment_count).to.equal(13);
          expect(res.body.articles[1].comment_count).to.equal(0);
          expect(res.body.articles[8].comment_count).to.equal(2);
        });
    });
    it("GET 200 articles array is sorted by any valid column from articles table.", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          expect(res.body.articles).to.be.sortedBy("topic", {
            descending: true
          });
        });
    });
    it("GET 200 articles array is sorted by the newly-added comment_count property", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          expect(res.body.articles).to.be.sortedBy("comment_count", {
            descending: true
          });
        });
    });
    it("GET 200 articles array is sorted by any valid column with order specifiable.", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          expect(res.body.articles).to.be.sortedBy("votes", {
            descending: false
          });
        });
    });
    it("GET 200 articles array is sorted by comment_count with order specifiable", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          expect(res.body.articles).to.be.sortedBy("comment_count", {
            descending: false
          });
        });
    });
    it("GET 200 articles array is filtered by author.", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          res.body.articles.forEach(article =>
            expect(article.author).to.equal("icellusedkars")
          );
          //expect(res.body.articles.length).to.equal(6) //Pagination could interfere with this.
        });
    });
    it("GET 200 articles array filtered by topic.", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          res.body.articles.forEach(article =>
            expect(article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ])
          );
          res.body.articles.forEach(article =>
            expect(article.topic).to.equal("mitch")
          );
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          //expect(res.body.articles.length).to.equal(11) //Pagination could interfere with this.
        });
    });
    it("GET 404b if nothing matches that ?query.", () => {
      return request(app)
        .get("/api/articles?topic=NON_EXISTENT_TOPIC")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["404b"]);
        });
    });
    it("GET 200 returns empty array if, say the author specified in the query does indeed exist in the database, but no articles are associated with them.", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
        });
    });
    it("GET 200 returns empty array if, say the topic specified in the query does indeed exist in the database, but no articles are associated with them.", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
        });
    });
    it("GET 400c returns error if invalid or nonexistent ?query in url.", () => {
      return request(app)
        .get("/api/articles?topiccccccccccccc=mitch")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400c"]);
        });
    });
    it("GET 400c returns error if multiple invalid or nonexistent ?queries in url.", () => {
      return request(app)
        .get(
          "/api/articles?topiccccccccccccc=mitch&authorrrrrrrrrr=icellusedkars"
        )
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400c"]);
        });
    });
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/articles";
      return Promise.all([request(app).del(url), request(app).patch(url)]).then(
        resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        }
      );
    });

    it("**POST 201 responds with created article.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "donovan",
          body: "Lord Rex is a bad man."
        })
        .expect(201)
        .then(res => {
          expect(res.body.article).to.have.all.keys([
            "title",
            "topic",
            "author",
            "body",
            "article_id",
            "created_at",
            "votes"
          ]);
          expect(res.body.article.author).to.equal("donovan");
          expect(res.body.article.article_id).to.equal(13);
          expect(res.body.article.body).to.equal("Lord Rex is a bad man.");
          expect(res.body.article.topic).to.equal("mitch");
          expect(res.body.article.votes).to.equal(0);
        });
    });

    it("**POST 201 responds with created article, including can specify how many votes.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "donovan",
          body: "Lord Rex is a bad man.",
          votes: 12
        })
        .expect(201)
        .then(res => {
          expect(res.body.article).to.have.all.keys([
            "title",
            "topic",
            "author",
            "body",
            "article_id",
            "created_at",
            "votes"
          ]);
          expect(res.body.article.author).to.equal("donovan");
          expect(res.body.article.article_id).to.equal(13);
          expect(res.body.article.body).to.equal("Lord Rex is a bad man.");
          expect(res.body.article.topic).to.equal("mitch");
          expect(res.body.article.votes).to.equal(12);
        });
    });

    it("**POST: 400a responds with error when missing fields", () => {
      return request(app)
        .post("/api/articles")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["400a"]);
        });
    });

    it("**POST: 400a responds with error when failing schema validation", () => {
      return request(app)
        .post("/api/articles")
        .send({
          titleeeeeeeeeeeeeeeeee: "Lord Rex",
          topic: "mitch",
          author: "donovan",
          body: "Lord Rex is a bad man."
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("**POST: 400a responds with error when failing schema validation due to too long field", () => {
      return request(app)
        .post("/api/articles")
        .send({
          titleeeeeeeeeeeeeeeeee: "Lord Rex",
          topic: "mitch",
          author: "donovan",
          body:
            "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("**POST 400a returns error when request contains other values.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "donovan",
          body: "Lord Rex is a bad man.",
          unnecessaryKey: "NOT_THIS"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("**POST 400b returns error when value is wrong type in request.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "donovan",
          body: "Lord Rex is a bad man.",
          votes: "banana"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400b"]);
        });
    });
    it("**Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/articles";
      return Promise.all([request(app).del(url), request(app).patch(url)]).then(
        resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        }
      );
    });

    describe("/:articleid", () => {
      it("**DELETE 204 returns no body after sucessful deletion", () => {
        return request(app)
          .del("/api/articles/3")
          .expect(204)
          .then(res => {
            expect(res.body).to.eql({});
          });
      });
      it("**DELETE 204   It was... definitely deleted, right?", () => {
        return request(app)
          .del("/api/articles/4")
          .expect(204)
          .then(res => {
            return request(app)
              .patch("/api/articles/4")
              .send({ inc_votes: 1000 })
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal(myErrMsgs["404a"]);
              });
          });
      });
      it("**DELETE 404a if id valid but nonexistent.", () => {
        return request(app)
          .del("/api/articles/6666")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("**DELETE 400b if invalid id.", () => {
        return request(app)
          .del("/api/articles/INVALID_ID")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
          });
      });
      it("**Responds 405 if any other methods are used at this endpoint", () => {
        const url = "/api/articles/2";
        return Promise.all([request(app).post(url)]).then(resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        });
      });

      it("GET 200 returns article by id, with the right properties, including comment_count.", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(res => {
            expect(res.body.article).to.be.an("Object");
            expect(res.body.article).to.have.all.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "body",
              "created_at",
              "votes",
              "comment_count"
            ]);
          });
      });
      it("GET 200 author is username from users table and comment_count equals number of comments for that article.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(res => {
            expect(res.body.article.author).to.equal("butter_bridge");
            expect(res.body.article.comment_count).to.equal(13);
          });
      });
      it("GET 404a if id valid but nonexistent.", () => {
        return request(app)
          .get("/api/articles/6666")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("GET 400b if invalid id.", () => {
        return request(app)
          .get("/api/articles/INVALID_ID")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
          });
      });

      it("PATCH 200 returns updated article with votes incremented according to request body", () => {
        return (
          request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1000 })
            .expect(200)

            //I think testing the exact object might be excessive, so I've trimmed it down to what comes after this chunk.
            // .then(res => {
            //     delete res.body.article.created_at
            //     expect(res.body.article).to.eql(  {
            //         article_id: 1,
            //         title: 'Living in the shadow of a great man',
            //         topic: 'mitch',
            //         author: 'butter_bridge',
            //         body: 'I find this existence challenging',
            //         //created_at: 1542284514171,
            //         votes: 1100,
            //       })
            // })

            .then(res => {
              expect(res.body.article.votes).to.equal(1100);
              expect(res.body.article).to.have.all.keys([
                "article_id",
                "title",
                "topic",
                "author",
                "body",
                "created_at",
                "votes"
              ]);
            })
        );
      });
      it("PATCH 200 returns updated article with votes decremented according to request body", () => {
        return (
          request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -5100 })
            .expect(200)

            //I think testing the exact object might be excessive, so I've trimmed it down to what comes after this chunk.
            // .then(res => {
            //     delete res.body.article.created_at
            //     expect(res.body.article).to.eql(  {
            //         article_id: 1,
            //         title: 'Living in the shadow of a great man',
            //         topic: 'mitch',
            //         author: 'butter_bridge',
            //         body: 'I find this existence challenging',
            //         //created_at: 1542284514171,
            //         votes: -5000,
            //       })
            // })
            .then(res => {
              expect(res.body.article.votes).to.equal(-5000);
              expect(res.body.article).to.have.all.keys([
                "article_id",
                "title",
                "topic",
                "author",
                "body",
                "created_at",
                "votes"
              ]);
            })
        );
      });

      it("PATCH 200 returns unchanged item when empty request.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(100);
            expect(res.body.article).to.have.all.keys([
              "article_id",
              "title",
              "topic",
              "author",
              "body",
              "created_at",
              "votes"
            ]);
          });
      });

      it("PATCH 404a returns error when id valid but no correspond.", () => {
        return request(app)
          .patch("/api/articles/6666")
          .send({ inc_votes: 1000 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("PATCH 400b returns error when id invalid.", () => {
        return request(app)
          .patch("/api/articles/INVALID_ID")
          .send({ inc_votes: 1000 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
          });
      });
      // it("PATCH 400a returns error when empty request.", () => {
      //   return request(app)
      //     .patch("/api/articles/1")
      //     .send({})
      //     .expect(400)
      //     .then(res => {
      //       expect(res.body.msg).to.equal(myErrMsgs["400a"]);
      //     });
      // });
      it("PATCH 400a returns error when missing fields, eg key mistyped in request.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votesssssssssssssssss: 1000 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400a"]);
          });
      });
      it("PATCH 400d returns error when value is wrong type in request.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400d"]);
          });
      });
      it("PATCH 400a returns error when request contains other values.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5, name: "Henrietta" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400a"]);
          });
      });
      it("Responds 405 if any other methods are used at this endpoint", () => {
        const url = "/api/articles/3";
        return Promise.all([request(app).post(url)]).then(resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        });
      });

      describe("/comments", () => {
        it("##GET 200 returns an array of comment objects, limited to 10 items by default, starting page 1 by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an("Array");
              expect(res.body.comments.length).to.equal(10);
              expect(res.body.total_count).to.equal(13);
            });
        });

        it("##GET 200 returns an array of comment objects, page and limit specifiable", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=6")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an("Array");
              expect(res.body.comments.length).to.equal(6);
              expect(res.body.total_count).to.equal(13);
            });
        });

        it("##GET 200 returns an array of comment objects, page and limit specifiable", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=6&p=1")
            .expect(200)
            .then(firstSixComments => {
              return request(app)
                .get("/api/articles/1/comments?limit=3&p=2")
                .expect(200)
                .then(secondThreeComments => {
                  expect(secondThreeComments.body.comments).to.be.an("Array");
                  expect(secondThreeComments.body.comments.length).to.equal(3);
                  expect(secondThreeComments.body.total_count).to.equal(13);
                  expect(firstSixComments.body.comments.slice(3, 6)).to.eql(
                    secondThreeComments.body.comments
                  );
                });
            });
        });

        it("GET 200 comments by article ID, each of which have all right keys, and are sorted by created_at in descending by default.", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an("Array");
              res.body.comments.forEach(comment =>
                expect(comment).to.have.all.keys([
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                ])
              );
              expect(res.body.comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("GET 200 comments by article ID, empty array for existing article that has no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an("Array");
              expect(res.body.comments).to.eql([]);
            });
        });
        it("GET 200 comments by article ID, where author is the username from users table.", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments[0].author).to.equal("icellusedkars");
            });
        });
        it("GET 200 comments by article ID, sorted by any column, in descending by default.", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=votes")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sortedBy("votes", {
                descending: true
              });
            });
        });
        it("GET 200 comments by article ID, sorted by any column, ascending can be specified.", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=author&order=asc")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sortedBy("author", {
                descending: false
              });
            });
        });
        it("GET 400c if invalid url query value.", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=aaaaaaaaaauthor")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["400c"]);
            });
        });
        it("GET 400c if invalid url query key.", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_byyyyyyyyyyy=author")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["400c"]);
            });
        });
        it("GET 404a if id valid but nonexistent.", () => {
          return request(app)
            .get("/api/articles/6666/comments?sort_by=author&order=asc")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["404a"]);
            });
        });
        it("GET 400b if invalid id.", () => {
          return request(app)
            .get("/api/articles/INVALID_ID/comments?sort_by=author&order=asc")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["400b"]);
            });
        });

        it("POST 201 responds with created comment.", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "Genghis", body: "Not enough pillaging" })
            .expect(201)

            .then(res => {
              delete res.body.comment.created_at;
              expect(res.body.comment).to.eql({
                comment_id: 19,
                author: "Genghis",
                article_id: 5,
                votes: 0,
                //created_at: '2020-02-25T14:23:37.689Z',
                body: "Not enough pillaging"
              });
            });

          //In case the above then statement is excessive, this below is a more succinct one:
          // .then(res => {
          //     expect(res.body.comment).to.have.all.keys(['comment_id', 'author', 'article_id', 'votes', 'body', 'created_at'])
          //     expect(res.body.comment.author).to.equal('Genghis')
          //     expect(res.body.comment.article_id).to.equal(5)
          // })
        });
        it("POST: 400a responds with error when missing fields", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({})
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.eql(myErrMsgs["400a"]);
            });
        });

        it("POST: 400a responds with error when failing schema validation", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({
              usernameeeeeeeeeeeeeeeeee: "Genghis",
              body: "Not enough pillaging"
            })
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["400a"]);
            });
        });
        it("POST 404a if id valid but nonexistent.", () => {
          return request(app)
            .post("/api/articles/6666/comments")
            .send({ username: "Genghis", body: "Not enough pillaging" })
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["404a"]);
            });
        });
        it("POST 400b if invalid id.", () => {
          return request(app)
            .post("/api/articles/INVALID_ID/comments")
            .send({ username: "Genghis", body: "Not enough pillaging" })
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["400b"]);
            });
        });
        it("POST 400a returns error when request contains other values.", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "Genghis",
              body: "Not enough pillaging",
              unnecessaryKey: "NOT_THIS"
            })
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(myErrMsgs["400a"]);
            });
        });
        it("Responds 405 if any other methods are used at this endpoint", () => {
          const url = "/api/articles/4/comments";
          return Promise.all([
            request(app).del(url),
            request(app).patch(url)
          ]).then(resArr => {
            resArr.forEach(response => {
              expect(405);
              expect(response.body.msg).to.equal(myErrMsgs["405"]);
            });
          });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH 200 returns updated comment with votes incremented according to request body", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: 1000 })
          .expect(200)

          .then(res => {
            expect(res.body.comment).to.eql({
              comment_id: 2,
              author: "butter_bridge",
              article_id: 1,
              votes: 1014,
              created_at: "2016-11-22T12:36:03.389Z",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
            });
          });

        //In case the above then statement is excessive, here below is a more succinct one:
        // .then(res => {
        //     expect(res.body.comment).to.have.all.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body'])
        //     expect(res.body.comment.comment_id).to.equal(2)
        //     expect(res.body.comment.votes).to.equal(1014)
        // })
      });
      it("PATCH 200 returns updated comment with votes decremented according to request body", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: -514 })
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.eql({
              comment_id: 2,
              author: "butter_bridge",
              article_id: 1,
              created_at: "2016-11-22T12:36:03.389Z",
              votes: -500,
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
            });
          });

        //In case the above then statement is excessive, here below is a more succinct one:
        // .then(res => {
        //     expect(res.body.comment).to.have.all.keys(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body'])
        //     expect(res.body.comment.comment_id).to.equal(2)
        //     expect(res.body.comment.votes).to.equal(-500)
        // })
      });
      it("PATCH 404a returns error when id valid but no correspond.", () => {
        return request(app)
          .patch("/api/comments/6666")
          .send({ inc_votes: 1000 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("PATCH 400b returns error when id invalid.", () => {
        return request(app)
          .patch("/api/comments/INVALID_ID")
          .send({ inc_votes: 1000 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
          });
      });
      it("PATCH 200 returns unchanged object when empty request.", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.eql({
              comment_id: 2,
              author: "butter_bridge",
              article_id: 1,
              votes: 14,
              created_at: "2016-11-22T12:36:03.389Z",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
            });
          });
      });
      it("PATCH 400a returns error when fields missing in request, eg mistyped keys.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votesssssssssssssssss: 1000 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400a"]);
          });
      });
      it("PATCH 400d returns error when value is wrong type in request.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400d"]);
          });
      });
      it("PATCH 400a returns error when request contains other values.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 5, name: "Henrietta" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400a"]);
          });
      });

      it("DELETE 204 returns no body after sucessful deletion", () => {
        return request(app)
          .del("/api/comments/3")
          .expect(204)
          .then(res => {
            expect(res.body).to.eql({});
          });
      });
      it("DELETE 204   It was... definitely deleted, right?", () => {
        return request(app)
          .del("/api/comments/4")
          .expect(204)
          .then(res => {
            return request(app)
              .patch("/api/comments/4")
              .send({ inc_votes: 1000 })
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal(myErrMsgs["404a"]);
              });
          });
      });
      it("DELETE 404a if id valid but nonexistent.", () => {
        return request(app)
          .del("/api/comments/6666")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("DELETE 400b if invalid id.", () => {
        return request(app)
          .del("/api/comments/INVALID_ID")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
          });
      });
      it("Responds 405 if any other methods are used at this endpoint", () => {
        const url = "/api/comments/2";
        return Promise.all([
          request(app).get(url),
          request(app).post(url)
        ]).then(resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        });
      });
    });
  });
});
