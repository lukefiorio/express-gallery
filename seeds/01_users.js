exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'architectMonkey', password: 'qwerty', role: 'user' },
        { username: 'brew', password: 'coffee', role: 'user' },
        { username: 'kingArchitect', password: 'sUp3rS+r0nG', role: 'admin' },
      ]);
    });
};
