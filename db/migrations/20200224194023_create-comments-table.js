const topics = require('./20200224144845_create-topics-table.js')
const users = require('./20200224160012_create-users-table.js')
const articles = require('./20200224172431_create-articles-table.js')

exports.up = function(knex) {
    
    console.log("In comments migrator")

    return knex.schema.createTable('comments', commentTable => {
        commentTable.increments('comment_id').primary()
        commentTable.string('author').notNullable().references(users.username)
        commentTable.integer('article_id').notNullable().references(articles.article_id)
        commentTable.integer('votes').defaultTo(0)
        commentTable.timestamp('created_at').defaultTo(knex.fn.now())
        commentTable.string('body').notNullable()
        
        console.log("Leaving comments migrator")
        
})};

exports.down = function(knex) {
    return knex.schema.dropTable('comments')
};