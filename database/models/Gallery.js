'use strict';

const bookshelf = require('../bookshelf');

class Gallery extends bookshelf.Model {
  get tableName() {
    return 'galleries';
  }
  get hasTimestamps() {
    return true;
  }

  users() {
    return this.belongsTo('User');
  }
}

module.exports = bookshelf.model('Gallery', Gallery);
