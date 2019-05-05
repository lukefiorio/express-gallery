const bookshelf = require('../bookshelf');

class Gallery extends bookshelf.Model {
  get tableName() {
    return 'galleries';
  }
  get hasTimestamps() {
    return true;
  }

  // could add a this.belongsTo('User');
}

module.exports = bookshelf.model('Gallery', Gallery);
