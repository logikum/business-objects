'use strict';

var fs = require('fs');
var path = require('path');
var DaoBase = require('../source/data-access/dao-base.js');
var ensureArgument = require('../source/system/ensure-argument.js');

var daoBuilder = function (dataSource, modelPath, modelName) {

  if (typeof dataSource !== 'string' || dataSource.trim().length === 0)
    throw new Error('The dataSource argument of daoBuilder function must be a non-empty string.');

  if (typeof modelPath !== 'string' || modelPath.trim().length === 0)
    throw new Error('The modelPath argument of daoBuilder function must be a non-empty string.');

  if (typeof modelName !== 'string' || modelName.trim().length === 0)
    throw new Error('The modelName argument of daoBuilder function must be a non-empty string.');

  var modelStats = fs.statSync(modelPath);
  if (!modelStats.isFile())
    throw new Error('The modelPath argument of daoBuilder function is not a valid file path: ' + modelPath);

  var daoPath = path.join(__dirname, dataSource, path.basename(modelPath));

  var daoStats = fs.statSync(daoPath);
  if (!daoStats.isFile())
    throw new Error('The required data access file does not exist: ' + daoPath);

  var daoCtor = require(daoPath);

  if (typeof daoCtor !== 'function')
    throw new Error('The data access file must return a constructor: ' + daoPath);

  return ensureArgument.isMandatoryType(new daoCtor(), DaoBase,
      daoPath + ' must inherit DaoBase type.');
};

module.exports = daoBuilder;
