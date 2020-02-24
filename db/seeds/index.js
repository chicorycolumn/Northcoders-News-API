const {topicData, articleData, commentData, userData} = require('../data/index.js')

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicData)
        .returning('*');
    })
    .then((houseRows) => {
        return knex('users')
        .insert(userData)
        .returning('*');
      // <-- do the rest of the seed logic here ...
    });
};




// exports.seed = function(knex){
//     return knex.migrate.rollback() // calls the down functions
//     .then(() => {
//     return knex.migrate.latest() // calls the up functions
//     })
//     .then(() => {
//     return knex.insert(houseData).into('houses').returning('*')
//     })
//     .then(houseRows => {
//     // now manipulate the wizardData now you have ids, cos we need to switch house name for id
//     //make ref obj
//     //format wizardData with it
//     //return it
//     })
//     }
    