'use strict';

var fs = require('fs');
var path = require('path');
var DaoBase = require('./dao-base.js');
var DaoError = require('./dao-error.js');

/**
 * Factory method to create the data access object for a model instance.
 *
 * @function bo.dataAccess.daoBuilder
 * @param {string} dataSource - The name of the data source.
 * @param {string} modelPath - The model definition path of the model instance
 *      that the data access object belongs to.
 *
 * @throws {@link bo.dataAccess.DaoError Dao error}: The name of the data source must be a non-empty string.
 * @throws {@link bo.dataAccess.DaoError Dao error}: The model path must be a non-empty string.
 * @throws {@link bo.dataAccess.DaoError Dao error}: The model path is not a valid file path.
 * @throws {@link bo.dataAccess.DaoError Dao error}: The required data access file does not exist.
 * @throws {@link bo.dataAccess.DaoError Dao error}: The data access file must return a constructor.
 * @throws {@link bo.dataAccess.DaoError Dao error}: The data access object must inherit DaoBase type.
 */
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
