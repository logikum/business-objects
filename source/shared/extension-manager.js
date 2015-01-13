/**
 * Asynchronous extension manager module.
 * @module shared/extension-manager
 */
'use strict';

var util = require('util');
var ExtensionManagerBase = require('./extension-manager-base.js');

function ExtensionManager(dataSource, modelPath) {
  ExtensionManager.super_.call(this, dataSource, modelPath, 2);

  Object.freeze(this);
}
util.inherits(ExtensionManager, ExtensionManagerBase);

module.exports = ExtensionManager;
