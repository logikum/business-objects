'use strict';

var ensureArgument = require('../shared/ensure-argument.js');

var DaoBase = function (name) {

  this.name = ensureArgument.isMandatoryString(name,
      'The name argument of a data access object constructor must be a non-empty string.');
};

module.exports = DaoBase;
