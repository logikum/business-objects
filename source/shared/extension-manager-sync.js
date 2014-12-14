'use strict';

var util = require('util');
var ExtensionManagerBase = require('./extension-manager-base.js');

function ExtensionManagerSync(dataSource, modelPath) {
  ExtensionManagerSync.super_.call(this, dataSource, modelPath, 1);

  Object.freeze(this);
}
util.inherits(ExtensionManagerSync, ExtensionManagerBase);

module.exports = ExtensionManagerSync;
