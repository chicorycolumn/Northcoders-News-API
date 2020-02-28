exports.up = function(knex) {
  return knex.schema.createTable(
    "users_articles_table",
    users_articles_table => {
      users_articles_table
        .string("voting_user")
        .notNullable()
        .references("users.username")
        .onDelete("CASCADE");
      users_articles_table
        .integer("article_id")
        .notNullable()
        .references("articles.article_id")
        .onDelete("CASCADE");
      users_articles_table.integer("inc_votes").defaultTo(0);
    }
  );
};

exports.down = function(knex) {
  return knex.schema.dropTable("users_articles_table");
};
