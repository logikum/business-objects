var NoAccessBehavior = require('../source/rules/no-access-behavior.js');

module.exports = {
  daoBuilder: '/source/data-access/dao-builder.js',
  userReader: '/sample/get-user.js',
  localeReader: '/sample/get-locale.js',
  pathOfLocales: '/locales',
  noAccessBehavior: NoAccessBehavior.throwError
};
