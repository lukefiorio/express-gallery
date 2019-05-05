const bookshelf = require('../bookshelf');

require('./Gallery');
class User extends bookshelf.Model {
  get tableName() {
    return 'users';
  }
  get hasTimestamps() {
    return true;
  }

  galleries() {
    return this.hasMany('Gallery');
  }
}

module.exports = bookshelf.model('User', User);
