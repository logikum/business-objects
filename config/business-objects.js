'use strict';

var NoAccessBehavior = require('../source/rules/no-access-behavior.js');

module.exports = {
  daoBuilder: '/source/data-access/dao-builder.js',
  userReader: '/sample/get-user.js',
  noAccessBehavior: NoAccessBehavior.throwError,
  pathOfLocales: '/locales',
  localeReader: '/sample/get-locale.js'
};
