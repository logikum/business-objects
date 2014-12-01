var NoAccessBehavior = require('../source/rules/no-access-behavior.js');

module.exports = {
  daoBuilder: '/source/data-access/dao-builder.js',
  userReader: '/sample/user-reader.js',
  noAccessBehavior: NoAccessBehavior.throwError
};
