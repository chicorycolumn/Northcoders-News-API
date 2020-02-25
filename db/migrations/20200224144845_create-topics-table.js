
exports.up = function(knex) {
    
    //console.log("In topics migrator")
    
    return knex.schema.createTable('topics', topicTable => {
        topicTable.string('slug').primary()
        topicTable.string('description').notNullable()

    //console.log("Leaving topics migrator")
})};

exports.down = function(knex) {
    return knex.schema.dropTable('topics')

};