
exports.up = function(knex) {
    
    console.log("In users migrator")
    
    return knex.schema.createTable('users', userTable => {
        userTable.string('username').primary()
        userTable.string('avatar_url')
        userTable.string('name').notNullable()

    console.log("Leaving users migrator")
})};

exports.down = function(knex) {
    return knex.schema.dropTable('users')

};