const topics = require("./20200224144845_create-topics-table.js");
const users = require("./20200224160012_create-users-table.js");

exports.up = function(knex) {
  return knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.string("body", 2000).notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .notNullable()
      .references("topics.slug")
      .onDelete("CASCADE");
    articleTable
      .string("author")
      .notNullable()
      .references("users.username")
      .onDelete("CASCADE");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
// -- CREATE TABLE articles (
//     --   article_id INT PRIMARY KEY,
//     --   title VARCHAR(255) NOT NULL,
//     --   body VARCHAR(255) NOT NULL,
//     --   votes INT DEFAULT 0,
//     --   topic VARCHAR(255) REFERENCES topics(slug) NOT NULL,
//     --   author VARCHAR(255) REFERENCES users(username) NOT NULL,
//     --   created_at INT DEFAULT Date.now() --And then will be manipulated.);
