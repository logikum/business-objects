'use strict';

var util = require('util');
var UserInfo = require('../source/system/user-info.js');

function User (userCode, userName, email, roles) {
  User.super_.call(this, userCode);

  this.userName = userName;
  this.email = email;
  this.roles = roles;

  Object.freeze(this);
}
util.inherits(User, UserInfo);

User.prototype.isInRole = function (role) {
  return this.roles.some(function (userRole) {
    return userRole === role;
  });
};

User.prototype.isInSomeRole = function (roles) {
  return this.roles.some(function (userRole) {
    return roles.some(function (role) {
      return userRole === role;
    });
  });
};

User.prototype.isInEveryRole = function (roles) {
  return roles.every(function (role) {
    return User.roles.some(function (userRole) {
      return userRole === role;
    });
  });
};

module.exports = User;
