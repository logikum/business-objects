'use strict';

var Enumeration = require('../shared/enumeration.js');

module.exports = new Enumeration(
  'readProperty', 'writeProperty',
  'fetchObject', 'createObject', 'updateObject', 'removeObject',
  'executeMethod'
);
