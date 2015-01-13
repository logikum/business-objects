/**
 * User information module.
 * @module shared/user-info
 */
'use strict';

var ensureArgument = require('./ensure-argument.js');
var NotImplementedError = require('./not-implemented-error.js');

function UserInfo (userCode) {

  userCode = ensureArgument.isOptionalString(userCode, 'c_optString', 'UserInfo', 'userCode');

  Object.defineProperty(this, 'userCode', {
    get: function () {
      return userCode;
    },
    set: function (value) {
      userCode = ensureArgument.isMandatoryString(userCode, 'p_optString', 'UserInfo', 'userCode');
    },
    enumeration: true
  });
}

UserInfo.prototype.isInRole = function (role) {
  throw new NotImplementedError('method', 'UserInfo', 'isInRole');
};

Object.seal(UserInfo.prototype);

module.exports = UserInfo;
