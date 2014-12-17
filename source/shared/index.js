'use strict';

var PropertyInfo = require('./property-info.js');
var PropertyManager = require('./property-manager.js');
var DataStore = require('./data-store.js');
var ExtensionManager = require('./extension-manager.js');
var ExtensionManagerSync = require('./extension-manager-sync.js');

var UserInfo = require('./user-info.js');
var DataContext = require('./data-context.js');
var TransferContext = require('./transfer-context.js');

var configuration = require('./config-reader.js');
var ensureArgument = require('./ensure-argument.js');
var Enumeration = require('./enumeration.js');
var PropertyFlag = require('./property-flag.js');

var ArgumentError = require('./argument-error.js');
var EnumerationError = require('./enumeration-error.js');
var NotImplementedError = require('./not-implemented-error.js');

var shared = {
  PropertyInfo: PropertyInfo,
  PropertyManager: PropertyManager,
  DataStore: DataStore,
  ExtensionManager: ExtensionManager,
  ExtensionManagerSync: ExtensionManagerSync,

  UserInfo: UserInfo,
  DataContext: DataContext,
  TransferContext: TransferContext,

  configuration: configuration,
  ensureArgument: ensureArgument,
  Enumeration: Enumeration,
  PropertyFlag: PropertyFlag,

  ArgumentError: ArgumentError,
  EnumerationError: EnumerationError,
  NotImplementedError: NotImplementedError
};

module.exports = shared;
