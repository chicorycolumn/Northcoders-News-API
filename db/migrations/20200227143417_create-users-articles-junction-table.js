exports.up = function(knex) {
  return knex.schema.createTable(
    "users_articles_table",
    users_articles_table => {
      users_articles_table
        .string("liking_user")
        .notNullable()
        .references("users.username")
        .onDelete("CASCADE");
      users_articles_table
        .integer("article_id")
        .notNullable()
        .references("articles.article_id")
        .onDelete("CASCADE");
      users_articles_table.integer("inc_votes").notNullable();
    }
  );
};

exports.down = function(knex) {
  return knex.schema.dropTable("users_articles_table");
};
