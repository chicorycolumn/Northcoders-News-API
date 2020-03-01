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

  //The order is GET PATCH POST DELETE

  describe("/", () => {
    it("GET 200 Serves up endpoints", () => {
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
    //Topics endpoint does not currently accept queries.
    // it("GET 200 returns an array of topic objects, limited to 10 items by default, starting page 1 by default", () => {
    //   return request(app)
    //     .get("/api/topics")
    //     .expect(200)
    //     .then(res => {
    //       expect(res.body.topics).to.be.an("Array");
    //       expect(res.body.topics.length).to.equal(10);
    //       expect(res.body.total_count).to.equal(13);
    //     });
    // });

    // it("GET 200 returns an array of topic objects, page and limit specifiable", () => {
    //   return request(app)
    //     .get("/api/topics?limit=6")
    //     .expect(200)
    //     .then(res => {
    //       expect(res.body.topics).to.be.an("Array");
    //       expect(res.body.topics.length).to.equal(6);
    //       expect(res.body.total_count).to.equal(13);
    //     });
    // });

    // it("GET 200 returns an array of comment objects, page and limit specifiable", () => {
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

    it("GET 200 returns array of all topics, with slug and description. #fetchTopics", () => {
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
    it("POST 201 responds with created topic. #createNewTopic", () => {
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

    it("POST 400a responds with error when missing fields", () => {
      return request(app)
        .post("/api/topics")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["400a"]);
        });
    });

    it("POST 400a responds with error when failing schema validation", () => {
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
    it("POST 400e responds with error when failing schema validation due to too long field", () => {
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
    it("POST 400a returns error when request contains other values.", () => {
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
    it("GET 200 returns array of all users. #fetchUsers", () => {
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
    it("POST 201 responds with created user. #createNewUser", () => {
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
    it("POST 400a responds with error when missing fields", () => {
      return request(app)
        .post("/api/users")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["400a"]);
        });
    });
    it("POST 400a responds with error when failing schema validation", () => {
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
    it("POST 400e responds with error when failing schema validation due to too long field", () => {
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
    it("POST 400a returns error when request contains other values.", () => {
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
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/users";
      return Promise.all([request(app).del(url)]).then(resArr => {
        resArr.forEach(response => {
          expect(405);
          expect(response.body.msg).to.equal(myErrMsgs["405"]);
        });
      });
    });

    describe("/:username", () => {
      it("GET 200 returns user by ID, which has username, avatar_url, and name. #fetchUsers", () => {
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
    it("PATCH 200 returns updated user with name changed according to request body. #updateUserDetails", () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .send({ name: "Samuel" })
        .expect(200)
        .then(res => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(res => {
              expect(res.body.user.username).to.equal("icellusedkars");
              expect(res.body.user.name).to.equal("Samuel");
            });
        });
    });
    it("PATCH 200 returns updated user with avatar_url changed according to request body", () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .send({
          avatar_url: "www.facebook.com/profile.jpg"
        })
        .expect(200)
        .then(res => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(res => {
              expect(res.body.user.username).to.equal("icellusedkars");
              expect(res.body.user.avatar_url).to.equal(
                "www.facebook.com/profile.jpg"
              );
            });
        });
    });
    it("PATCH 200 returns updated user with avatar_url AND name changed according to request body", () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .send({
          avatar_url: "www.facebook.com/profile.jpg",
          name: "Samuel"
        })
        .expect(200)
        .then(res => {
          expect(res.body.user.username).to.equal("icellusedkars");
          expect(res.body.user.name).to.equal("Samuel");
          expect(res.body.user.avatar_url).to.equal(
            "www.facebook.com/profile.jpg"
          );
        });
    });
    it("PATCH 404a returns error when username valid but no correspond.", () => {
      return request(app)
        .patch("/api/users/NON_EXI_USER")
        .send({
          avatar_url: "www.facebook.com/profile.jpg",
          name: "Samuel"
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["404a"]);
        });
    });
    it("PATCH 200 returns unchanged object when empty request.", () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .send({})
        .expect(200)
        .then(res => {
          expect(res.body.user).to.eql({
            username: "icellusedkars",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            name: "sam"
          });
        });
    });
    it("PATCH 400a returns error when fields missing in request, eg mistyped keys.", () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .send({ nameeeeeeeeeeeeeeee: "Samuel" })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    // it("PATCH 400d returns error when avatar_url fails url regex test.", () => {
    //   return request(app)
    //     .patch("/api/comments/1")
    //     .send({
    //       avatar_url: "/not.a.valid.url",
    //       name: "Samuel"
    //     })
    //     .expect(400)
    //     .then(res => {
    //       expect(res.body.msg).to.equal(myErrMsgs["400d"]);
    //     });
    // });
    it("PATCH 400a returns error when request contains other values.", () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .send({
          avatar_url: "www.facebook.com/profile.jpg",
          name: "Samuel",
          BADKEY: "NO NEED FOR THIS"
        })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(myErrMsgs["400a"]);
        });
    });
    it("Responds 405 if any other methods are used at this endpoint", () => {
      const url = "/api/users/:username";
      return Promise.all([request(app).del(url), request(app).post(url)]).then(
        resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        }
      );
    });
  });
  describe("/articles", () => {
    // Hey listen up! The function may solely bring back articles with votes in the junction table, rather than all articles. We finna fix dat.
    it("GET 200 returns an array of article objects, limited to 10 items by default, starting page 1 by default. #fetchArticleData", () => {
      return Promise.all([
        request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1, voting_user: "butter_bridge" }),

        request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: -1, voting_user: "lurker" }),

        request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1, voting_user: "icellusedkars" }),

        request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: 1, voting_user: "icellusedkars" })
      ]).then(res => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.an("Array");
            expect(res.body.articles.length).to.equal(10);
            expect(res.body.total_count).to.equal(12);
          });
      });
    });
    it("GET 200 returns an array of article objects, can ?query for articles from the last so many minutes.", () => {
      return request(app)
        .get("/api/articles?minutes=10000000")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          expect(res.body.articles.length).to.equal(5);
          expect(res.body.total_count).to.equal(5);
        });
    });
    it("GET 200 returns an array of article objects, limit specifiable", () => {
      return request(app)
        .get("/api/articles?limit=6")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          expect(res.body.articles.length).to.equal(6);
          expect(res.body.total_count).to.equal(12);
        });
    });
    it("GET 200 returns an array of article objects, page and limit specifiable", () => {
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
    it("GET 200 articles array is sorted by any valid column from articles table, like topic.", () => {
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
    it("GET 200 articles array is filtered by title where title is one word.", () => {
      return request(app)
        .get("/api/articles?title=Moustache")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          expect(res.body.articles.length).to.not.equal(0);
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
            expect(article.title).to.equal("Moustache")
          );
        });
    });
    it("GET 200 articles array is filtered by title where title is many words.", () => {
      return request(app)
        .get("/api/articles?title=Am I a cat?")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("Array");
          expect(res.body.articles.length).to.not.equal(0);
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
            expect(article.title).to.equal("Am I a cat?")
          );
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
    it("GET 200 articles array filtered by user who downvoted them.", () => {
      return Promise.all([
        request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "butter_bridge" }),

        request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: -1, voting_user: "butter_bridge" }),

        request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: -1, voting_user: "lurker" }),

        request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: -1, voting_user: "lurker" })
      ]).then(() => {
        return request(app)
          .get("/api/articles?voted_by=butter_bridge&vote_direction=down")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.eql([
              {
                comment_count: 0,
                author: "icellusedkars",
                title: "Eight pug gifs that remind me of mitch",
                article_id: 3,
                votes: -2,
                topic: "mitch",
                created_at: "2010-11-17T12:21:54.171Z"
              }
            ]);
          });
      });
    });
    xit("GET 200 When the upvotes are all sent through at once, does the function know not to count the same user's upvote more than once?", () => {
      return Promise.all([
        request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "lurker" }),

        request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "butter_bridge" }),

        request(app)
          .patch("/api/articles/5")
          .send({ inc_votes: 1, voting_user: "butter_bridge" }),

        request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1, voting_user: "lurker" }),

        request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1, voting_user: "lurker" })
      ]).then(resArr => {
        resArr.forEach(x => console.log(x.body.article));
        return request(app)
          .get("/api/articles?voted_by=lurker")
          .expect(200)
          .then(res => {
            console.log(res.body.articles);
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articles).to.eql([
              {
                comment_count: 13,
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                votes: 102,
                topic: "mitch",
                created_at: "2018-11-15T12:21:54.171Z"
              },
              {
                comment_count: 0,
                author: "icellusedkars",
                title: "Eight pug gifs that remind me of mitch",
                article_id: 3,
                votes: 1,
                topic: "mitch",
                created_at: "2010-11-17T12:21:54.171Z"
              }
            ]);
          });
      });
    });
    it("GET 200 empty array if nothing matches that voted_by ?query.", () => {
      return request(app)
        .get("/api/articles?voted_by=NON_EXISTING_USER")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
        });
    });
    it("GET 200 returns empty array if, say the user specified in the query does indeed exist in the database, but they haven't upvoted/downvoted anything.", () => {
      return request(app)
        .get("/api/articles?voted_by=lurker")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
        });
    });
    it("GET 200 empty array if nothing matches that ?query.", () => {
      return request(app)
        .get("/api/articles?topic=NON_EXISTENT_TOPIC")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.eql([]);
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
    it("POST 201 responds with created article. #createNewArticle", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "butter_bridge",
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
          expect(res.body.article.author).to.equal("butter_bridge");
          expect(res.body.article.article_id).to.equal(13);
          expect(res.body.article.body).to.equal("Lord Rex is a bad man.");
          expect(res.body.article.topic).to.equal("mitch");
          expect(res.body.article.votes).to.equal(0);
        });
    });
    it("POST 201 responds with created article, including can specify how many votes.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "butter_bridge",
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
          expect(res.body.article.author).to.equal("butter_bridge");
          expect(res.body.article.article_id).to.equal(13);
          expect(res.body.article.body).to.equal("Lord Rex is a bad man.");
          expect(res.body.article.topic).to.equal("mitch");
          expect(res.body.article.votes).to.equal(12);
        });
    });
    it("POST 404c responds error if topic specified in request body not exist.", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "NON_EXISTENT_TOPIC",
          author: "butter_bridge",
          body: "Lord Rex is a bad man.",
          votes: 12
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["404c"]);
        });
    });
    it("POST 404c responds error if author specified in request body not exist", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Lord Rex",
          topic: "mitch",
          author: "NON_EXISTENT_AUTHOR",
          body: "Lord Rex is a bad man.",
          votes: 12
        })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["404c"]);
        });
    });
    it("POST 400a responds with error when missing fields", () => {
      return request(app)
        .post("/api/articles")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.eql(myErrMsgs["400a"]);
        });
    });
    it("POST 400a responds with error when failing schema validation", () => {
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
    it("POST 400a responds with error when failing schema validation due to too long field", () => {
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
    it("POST 400a returns error when request contains other values.", () => {
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
    it("POST 400b returns error when value is wrong type in request.", () => {
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
    describe("/votes", () => {
      xit("GET 200 ADMIN returns junction table of article votes. #fetchArticleVotesJunctionTable", () => {
        return Promise.all([
          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: -1, voting_user: "butter_bridge" }),

          request(app)
            .patch("/api/articles/4")
            .send({ inc_votes: 1, voting_user: "lurker" }),

          request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: -1, voting_user: "icellusedkars" }),

          request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: -1, voting_user: "butter_bridge" })
        ]).then(res => {
          return request(app)
            .get("/api/articles/votes")
            .then(res => {
              chai.use(require("chai-like"));
              chai.use(require("chai-things"));
              expect(res.body.article_votes_junction.length).to.equal(4);
              expect(res.body.article_votes_junction)
                .to.be.an("array")
                .that.includes.something.like({
                  voting_user: "butter_bridge",
                  article_id: 2,
                  inc_votes: -1
                });
              expect(res.body.article_votes_junction)
                .to.be.an("array")
                .that.includes.something.like({
                  voting_user: "lurker",
                  article_id: 4,
                  inc_votes: 1
                });
              expect(res.body.article_votes_junction)
                .to.be.an("array")
                .that.includes.something.like({
                  voting_user: "icellusedkars",
                  article_id: 6,
                  inc_votes: -1
                });
              expect(res.body.article_votes_junction)
                .to.be.an("array")
                .that.includes.something.like({
                  voting_user: "butter_bridge",
                  article_id: 6,
                  inc_votes: -1
                });
              chai.use(require("sams-chai-sorted"));
            });
        });
      });
      xit("GET 200 ADMIN returns junction table of article votes, DELETE 204 all votes associated with that article are deleted too! #deleteArticleByID, #fetchArticleVotesJunctionTable", () => {
        return Promise.all([
          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: -1, voting_user: "butter_bridge" }),

          request(app)
            .patch("/api/articles/4")
            .send({ inc_votes: 1, voting_user: "lurker" }),

          request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: -1, voting_user: "icellusedkars" }),

          request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: -1, voting_user: "butter_bridge" })
        ])
          .then(() => {
            return request(app)
              .del("/api/articles/6")
              .expect(204);
          })

          .then(res => {
            return request(app)
              .get("/api/articles/votes")
              .then(res => {
                chai.use(require("chai-like"));
                chai.use(require("chai-things"));

                expect(res.body.article_votes_junction.length).to.equal(2);

                expect(res.body.article_votes_junction)
                  .to.be.an("array")
                  .that.includes.something.like({
                    voting_user: "lurker",
                    article_id: 4,
                    inc_votes: 1
                  });

                expect(res.body.article_votes_junction)
                  .to.be.an("array")
                  .that.includes.something.like({
                    voting_user: "butter_bridge",
                    article_id: 2,
                    inc_votes: -1
                  });
                chai.use(require("sams-chai-sorted"));
              });
          });
      });
    });
    describe("/:articleid", () => {
      it("GET 200 returns article object where vote is calculated by upvotes from users, add to base vote level from data file, limited to 10 items by default, starting page 1 by default. #fetchArticleData", () => {
        return Promise.all([
          request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -1, voting_user: "butter_bridge" }),

          request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -1, voting_user: "lurker" }),

          request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -1, voting_user: "icellusedkars" }),

          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 1, voting_user: "icellusedkars" })
        ]).then(res => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(res => {
              expect(res.body.article.votes).to.equal(97);
              expect(res.body.article.comment_count).to.equal(13);
              expect(res.body.article.article_id).to.equal(1);
            });
        });
      });
      it("GET 200 returns article object where vote is calculated by downvotes and upvotes from users, add to base vote level from data file, limited to 10 items by default, starting page 1 by default", () => {
        return Promise.all([
          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: -1, voting_user: "butter_bridge" }),

          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 1, voting_user: "lurker" }),

          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: -1, voting_user: "icellusedkars" })
        ]).then(res => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an("Object");
              expect(res.body.article.votes).to.equal(-1);
            });
        });
      });
      it("GET 200 returns article object where vote is calculated by downvotes and upvotes, and not interfered with by votes on other articles", () => {
        return Promise.all([
          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 1, voting_user: "butter_bridge" }),

          request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: 1, voting_user: "lurker" }),

          request(app)
            .patch("/api/articles/4")
            .send({ inc_votes: 1, voting_user: "icellusedkars" })
        ]).then(res => {
          return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an("Object");
              expect(res.body.article.votes).to.equal(2);
            });
        });
      });
      it("GET 200 returns article by id, where comment_count is 0, not null, if no comments yet.", () => {
        return request(app)
          .get("/api/articles/8")
          .expect(200)
          .then(res => {
            expect(res.body.article).to.be.an("Object");
            expect(res.body.article.comment_count).to.equal(0);
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
      it("PATCH 200 Adds row to junction table re user adding a vote to an article. #addVoteToArticleByUser", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            expect(res.body.article).to.eql({
              voting_user: "butter_bridge",
              article_id: 1,
              inc_votes: 1
            });
          });
      });
      it("PATCH 200 Adds row to junction table re user adding a negative vote to an article.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            expect(res.body.article).to.eql({
              voting_user: "butter_bridge",
              article_id: 1,
              inc_votes: -1
            });
          });
      });
      it("PATCH 404 You cannot upvote from nonexistent user.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1, voting_user: "NON_EXI_USER" })
          .expect(404); // What is best error message?
      });
      it("PATCH 400 User cannot submit a number greater 1 as a vote.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 2, voting_user: "butter_bridge" })
          .expect(400); // What is best error message?
      });
      it("PATCH 400 User cannot submit a number less than -1 as a vote.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -2, voting_user: "butter_bridge" })
          .expect(400); // What is best error message?
      });
      it("PATCH 400 User cannot upvote same article more than once.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1, voting_user: "butter_bridge" })
              .expect(400); // What is best error message?
          });
      });
      it("PATCH 400 User cannot downvote same article more than once.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -1, voting_user: "butter_bridge" })
              .expect(400); // What is best error message?
          });
      });
      it("PATCH 400 User can negate their downvote with a subsequent upvote and then upvote again, but not again again.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 1, voting_user: "butter_bridge" })
              .expect(200)
              .then(res => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: 1, voting_user: "butter_bridge" })
                  .expect(200);
              })
              .then(res => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: 1, voting_user: "butter_bridge" })
                  .expect(400);
              });
          });
      });
      it("PATCH 400 User can negate their upvote with a subsequent downvote and then downvote again, but not again again.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -1, voting_user: "butter_bridge" })
              .expect(200)
              .then(res => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: -1, voting_user: "butter_bridge" })
                  .expect(200);
              })
              .then(res => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: -1, voting_user: "butter_bridge" })
                  .expect(400);
              });
          });
      });
      it("PATCH 400 User can negate their upvote with a subsequent downvote and then upvote again, but not again again.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, voting_user: "butter_bridge" })
          .expect(200)
          .then(res => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -1, voting_user: "butter_bridge" })
              .expect(200)
              .then(res => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: 1, voting_user: "butter_bridge" })
                  .expect(200);
              })
              .then(res => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({ inc_votes: 1, voting_user: "butter_bridge" })
                  .expect(400);
              });
          });
      });
      it("PATCH 200 Can update body. Returns updated article. #updateArticleTitleTopicBodyOrAuthor", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ body: "Get my green pak choi, squire!" })
          .expect(200)
          .then(res => {
            expect(res.body.article.body).to.equal(
              "Get my green pak choi, squire!"
            );
            expect(res.body.article.title).to.equal("Student SUES Mitch!");
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
      it("PATCH 200 Can update title, and/or body, and/or author. Returns updated article.", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({
            author: "butter_bridge",
            title: "Andrew Wyeth paintings",
            body: "The woman is alone in the field."
          })
          .expect(200)
          .then(res => {
            expect(res.body.article.body).to.equal(
              "The woman is alone in the field."
            );
            expect(res.body.article.article_id).to.equal(4);
            expect(res.body.article.author).to.equal("butter_bridge");
            expect(res.body.article.title).to.equal("Andrew Wyeth paintings");
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
      it("PATCH 200 Returns updated article title.", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({ title: "Lick this tree of oak and grain." })
          .expect(200)
          .then(res => {
            expect(res.body.article.article_id).to.equal(5);
            expect(res.body.article.title).to.equal(
              "Lick this tree of oak and grain."
            );
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

      it("PATCH 200 Returns updated article author.", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ author: "lurker" })
          .expect(200)
          .then(res => {
            expect(res.body.article.title).to.equal(
              "Sony Vaio; or, The Laptop"
            );
            expect(res.body.article.author).to.equal("lurker");
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
      it("PATCH 404c Returns error if try to update author to non existing author.", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ author: "NON_EXI_USER" })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404c"]);
          });
      });
      it("PATCH 200 ADMIN returns updated article with votes incremented according to request body. #updateArticleVotes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1000 })
          .expect(200)
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
          });
      });
      it("PATCH 200 ADMIN returns updated article with votes decremented according to request body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -5100 })
          .expect(200)
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
          });
      });
      it("PATCH 200 ADMIN returns unchanged item when empty request.", () => {
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
      it("PATCH 404a ADMIN returns error when id valid but no correspond.", () => {
        return request(app)
          .patch("/api/articles/6666")
          .send({ inc_votes: 1000 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("PATCH 400b ADMIN returns error when id invalid.", () => {
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
      it("PATCH 400a ADMIN returns error when missing fields, eg key mistyped in request.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votesssssssssssssssss: 1000 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400a"]);
          });
      });
      it("PATCH 400d ADMIN returns error when value is wrong type in request.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400d"]);
          });
      });
      it("PATCH 400a ADMIN returns error when request contains other values.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5, name: "Henrietta" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400a"]);
          });
      });
      it("DELETE 204 all comments associated with that article are deleted too! #deleteArticleByID", () => {
        return request(app)
          .del("/api/articles/1")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(404); // for id valid but nonexistent!
          });
      });
      it("DELETE 204 returns no body after sucessful deletion", () => {
        return request(app)
          .del("/api/articles/3")
          .expect(204)
          .then(res => {
            expect(res.body).to.eql({});
          });
      });
      it("DELETE 204   It was... definitely deleted, right?", () => {
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
      it("DELETE 404a if id valid but nonexistent.", () => {
        return request(app)
          .del("/api/articles/6666")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("DELETE 400b if invalid id.", () => {
        return request(app)
          .del("/api/articles/INVALID_ID")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
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
      it("Responds 405 if any other methods are used at this endpoint", () => {
        const url = "/api/articles/2";
        return Promise.all([request(app).post(url)]).then(resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        });
      });
      describe("/comments", () => {
        it("GET 200 returns an array of comment objects, limited to 10 items by default, starting page 1 by default. #fetchCommentsByArticle", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an("Array");
              expect(res.body.comments.length).to.equal(10);
              expect(res.body.total_count).to.equal(13);
            });
        });
        it("GET 200 returns an array of comment objects, page and limit specifiable", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=6")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an("Array");
              expect(res.body.comments.length).to.equal(6);
              expect(res.body.total_count).to.equal(13);
            });
        });
        it("GET 200 returns an array of comment objects, page and limit specifiable", () => {
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
        it("POST 201 responds with created comment. #createNewCommentOnArticle", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "butter_bridge", body: "I like butter" })
            .expect(201)
            .then(res => {
              delete res.body.comment.created_at;
              expect(res.body.comment).to.eql({
                comment_id: 19,
                author: "butter_bridge",
                article_id: 5,
                votes: 0,
                //created_at: '2020-02-25T14:23:37.689Z',
                body: "I like butter"
              });
            });
        });
        it("POST 404c if submitting comment with author that doesn't exist!", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({ username: "Genghis", body: "Not enough pillaging" })
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.eql(myErrMsgs["404c"]);
            });
        });
        it("POST 400a responds with error when missing fields", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({})
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.eql(myErrMsgs["400a"]);
            });
        });

        it("POST 400a responds with error when failing schema validation", () => {
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
      it("GET 200 returns comment by ID. #fetchCommentByID", () => {
        return request(app)
          .get("/api/comments/5")
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.be.an("Object");
            expect(res.body.comment).to.have.all.keys([
              "author",
              "comment_id",
              "article_id",
              "votes",
              "created_at",
              "body"
            ]);
            expect(res.body.comment.comment_id).to.equal(5);
          });
      });
      it("GET 404a returns error when id valid but no correspond.", () => {
        return request(app)
          .patch("/api/comments/6666")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["404a"]);
          });
      });
      it("GET 400b returns error when id invalid.", () => {
        return request(app)
          .patch("/api/comments/INVALID_ID")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(myErrMsgs["400b"]);
          });
      });
      it("PATCH 200 returns updated comment with body changed according to request body. #updateCommentDetails", () => {
        return request(app)
          .patch("/api/comments/5")
          .send({ body: "Reading this cured my emphesema." })
          .expect(200)
          .then(res => {
            return request(app)
              .get("/api/comments/5")
              .expect(200)
              .then(res => {
                expect(res.body.comment.comment_id).to.equal(5);
                expect(res.body.comment.body).to.equal(
                  "Reading this cured my emphesema."
                );
              });
          });
      });
      it("PATCH 200 ADMIN returns updated comment with body AND votes changed according to request body", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({
            body: "Reading this cured my vitamin D deficiency.",
            inc_votes: 86
          })
          .expect(200)
          .then(res => {
            return request(app)
              .get("/api/comments/2")
              .expect(200)
              .then(res => {
                expect(res.body.comment.comment_id).to.equal(2);
                expect(res.body.comment.votes).to.equal(100);
                expect(res.body.comment.body).to.equal(
                  "Reading this cured my vitamin D deficiency."
                );
              });
          });
      });
      it("PATCH 200 ADMIN returns updated comment with votes incremented according to request body", () => {
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
      it("PATCH 200 ADMIN returns updated comment with votes decremented according to request body", () => {
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
      it("DELETE 204 returns no body after sucessful deletion. #deleteCommentByID", () => {
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
        return Promise.all([request(app).post(url)]).then(resArr => {
          resArr.forEach(response => {
            expect(405);
            expect(response.body.msg).to.equal(myErrMsgs["405"]);
          });
        });
      });
    });
  });
});
