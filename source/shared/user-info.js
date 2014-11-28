'use strict';

var ensureArgument = require('./ensure-argument.js');
var NotImplementedError = require('./not-implemented-error.js');

function UserInfo (userCode) {

  this.userCode = ensureArgument.isOptionalString(userCode,
      'The userCode argument of UserInfo constructor must be a string or null.');
}

UserInfo.prototype.isInRole = function (role) {
  throw new NotImplementedError('The UserInfo.isInRole method is not implemented.');
};

module.exports = UserInfo;
