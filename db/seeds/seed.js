const {topicData, articleData, commentData, userData} = require('../data/index.js'); // Have now made index file.
// Are these actually present in source? Or just testData object?

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  const topicsInsertions = knex('topics').insert(topicData);
  const usersInsertions = knex('users').insert(userData);


  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {


  return Promise.all([topicsInsertions, usersInsertions])
    .then((mystery) => {
      console.log(mystery)
      console.log("##First Promise all")
      //NB1
    })
    // .then(articleRows => {
    //   console.log("##Next bit of Promise all")
    //   //NB2
    //   const articleRef = makeRefObj(articleRows);
    //   const formattedComments = formatComments(commentData, articleRef);
    //   return knex('comments').insert(formattedComments);
    // });

  })
};


// exports.seed = function(knex){
// return knex.migrate.rollback() // calls the down functions
// .then(() => {
// return knex.migrate.latest() // calls the up functions
// })
// .then(() => {
// return knex.insert(houseData).into('houses').returning('*')
// })
// .then(houseRows => {
// now manipulate the wizardData now you have ids, cos we need to switch house name for id
//make ref obj
//format wizardData with it
//return it
// })
// }












      /* 
      NB1

      Your article data is currently in the incorrect format 
      and will violate your SQL schema. 
      
      You will need to write and test the provided formatDate 
      utility function to be able insert your article data.

      Your comment insertions will depend on information 
      from the seeded articles, so make sure to return 
      the data after it's been seeded.
      */


            /* 
      NB2

      Your comment data is currently in the incorrect 
      format and will violate your SQL schema. 

      Keys need renaming, values need changing, and 
      most annoyingly, your comments currently only 
      refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided 
      makeRefObj and formatComments utility functions 
      to be able insert your comment data.
      */