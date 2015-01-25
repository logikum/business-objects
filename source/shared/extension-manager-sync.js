'use strict';

var util = require('util');
var ExtensionManagerBase = require('./extension-manager-base.js');

/**
 * @classdesc
 *    Provides properties to customize synchronous models' behavior.
 * @description
 *    Creates a new extension manager object for a synchronous model.
 *
 * @memberof bo.shared
 * @constructor
 *
 * @param {string} dataSource - The name of the data source.
 * @param {string} modelPath - The full path of the model.
 *
 * @extends bo.shared.ExtensionManagerBase
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The data source must be a non-empty string.
 * @throws {@link bo.shared.ArgumentError Argument error}: The model path must be a non-empty string.
 */
function ExtensionManagerSync(dataSource, modelPath) {
  ExtensionManagerSync.super_.call(this, dataSource, modelPath, 1);

  Object.freeze(this);
}
util.inherits(ExtensionManagerSync, ExtensionManagerBase);

module.exports = ExtensionManagerSync;
