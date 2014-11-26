var fs = require('fs');
var path = require('path');

var daoBuilder = function (dataSource, modelPath) {

  if (typeof dataSource !== 'string' || dataSource.trim().length === 0)
    throw new Error('The dataSource argument of daoBuilder function must be a non-empty string.');

  if (typeof modelPath !== 'string' || modelPath.trim().length === 0)
    throw new Error('The modelPath argument of daoBuilder function must be a non-empty string.');

  var modelStats = fs.statSync(modelPath);
  if (!modelStats.isFile())
    throw new Error('The modelPath argument of daoBuilder function is not a valid file path: ' + modelPath);

  var daoPath = path.join(
    path.dirname(modelPath),
    path.basename(modelPath, path.extname(modelPath)) + '.' + dataSource + path.extname(modelPath)
  );

  var daoStats = fs.statSync(daoPath);
  if (!daoStats.isFile())
    throw new Error('The required data access file does not exist: ' + daoPath);

  var dao = require(daoPath);

  if (typeof dao !== 'function')
    throw new Error('The data access file must return a constructor: ' + daoPath);

  return new dao();
};

module.exports = daoBuilder;
