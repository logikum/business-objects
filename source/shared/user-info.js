'use strict';

var ensureArgument = require('./ensure-argument.js');
var NotImplementedError = require('./not-implemented-error.js');

/**
 * @classdesc Serves as the base class for user information object.
 * @description Creates a new user information object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} [userCode] - The identifier of the user.
 *
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The userCode must be a string or null.
 */
function UserInfo (userCode) {

  userCode = ensureArgument.isOptionalString(userCode, 'c_optString', 'UserInfo', 'userCode');

  /**
   * The identifier of the user.
   * @name bo.shared.UserInfo#userCode
   * @type {string}
   */
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

/**
 * Abstract method to determine if the user is member of the given role.
 *
 * @abstract
 * @function bo.shared.UserInfo#isInRole
 * @param {strng} role - The name of the role.
 * @returns {boolean} True if the user is a member of the role, otherwise false.
 *
 * @throws {@link bo.shared.NotImplementedError NotImplementedError}: The UserInfo.isInRole method is not implemented.
 */
UserInfo.prototype.isInRole = function (role) {
  throw new NotImplementedError('method', 'UserInfo', 'isInRole');
};

Object.seal(UserInfo.prototype);

module.exports = UserInfo;
