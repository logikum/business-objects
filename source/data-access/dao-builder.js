'use strict';

var fs = require('fs');
var path = require('path');
var DaoBase = require('./dao-base.js');
var DaoError = require('./dao-error.js');

var daoBuilder = function (dataSource, modelPath) {

  if (typeof dataSource !== 'string' || dataSource.trim().length === 0)
    throw new DaoError('f_manString', 'dataSource');
  if (typeof modelPath !== 'string' || modelPath.trim().length === 0)
    throw new DaoError('f_manString', 'modelPath');

  var modelStats = fs.statSync(modelPath);
  if (!modelStats.isFile())
    throw new DaoError('filePath', 'modelPath', modelPath);

  var daoPath = path.join(
    path.dirname(modelPath),
    path.basename(modelPath, path.extname(modelPath)) + '.' + dataSource + path.extname(modelPath)
  );

  var daoStats = fs.statSync(daoPath);
  if (!daoStats.isFile())
    throw new DaoError('noDaoFile', daoPath);

  var daoConstructor = require(daoPath);

  if (typeof daoConstructor !== 'function')
    throw new DaoError('daoCtor', daoPath);

  var daoInstance = new daoConstructor();
  if (!(daoInstance instanceof DaoBase) && daoInstance.super_ !== DaoBase)
    throw new DaoError('daoType', daoPath);
  return daoInstance;
};

module.exports = daoBuilder;
