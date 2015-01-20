'use strict';

var util = require('util');
var ExtensionManagerBase = require('./extension-manager-base.js');

/**
 * @classdesc
 *    Provides properties to customize asynchronous models' behavior.
 * @description
 *    Creates a new extension manager object for an asynchronous model.
 *
 * @memberof bo.shared
 * @constructor
 *
 * @param {string} dataSource - The name of the data source.
 * @param {string} modelPath - The full path of the model.
 *
 * @extends bo.shared.ExtensionManagerBase
 *
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The data source must be a non-empty string.
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The model path must be a non-empty string.
 */
function ExtensionManager(dataSource, modelPath) {
  ExtensionManager.super_.call(this, dataSource, modelPath, 2);

  Object.freeze(this);
}
util.inherits(ExtensionManager, ExtensionManagerBase);

module.exports = ExtensionManager;
