const bcrypt = require('bcryptjs');
const saltRounds = 12;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'monkey',
          password: bcrypt.hashSync('qwerty', saltRounds),
          role: 'user',
        },
        {
          username: 'brew',
          password: bcrypt.hashSync('coffee', saltRounds),
          role: 'user',
        },
        {
          username: 'ash',
          password: bcrypt.hashSync('fire', saltRounds),
          role: 'user',
        },
        {
          username: 'king',
          password: bcrypt.hashSync('strong', saltRounds),
          role: 'admin',
        },
      ]);
    });
};
