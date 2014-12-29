'use strict';

var EditableModel = require('./editable-model.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyModel = require('./read-only-model.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

var EditableModelSync = require('./editable-model-sync.js');
var EditableChildCollectionSync = require('./editable-child-collection-sync.js');
var ReadOnlyModelSync = require('./read-only-model-sync.js');
var ReadOnlyRootCollectionSync = require('./read-only-root-collection-sync.js');
var ReadOnlyChildCollectionSync = require('./read-only-child-collection-sync.js');
var CommandObjectSync = require('./command-object-sync.js');

var dataTypes = require('./data-types/index.js');
var commonRules = require('./common-rules/index.js');
var daoBuilder = require('./data-access/dao-builder.js');
var shared = require('./shared/index.js');
var rules = require('./rules/index.js');

var businessObjects = {
  EditableModel: EditableModel,
  EditableChildCollection: EditableChildCollection,
  ReadOnlyModel: ReadOnlyModel,
  ReadOnlyRootCollection: ReadOnlyRootCollection,
  ReadOnlyChildCollection: ReadOnlyChildCollection,
  CommandObject: CommandObject,

  EditableModelSync: EditableModelSync,
  EditableChildCollectionSync: EditableChildCollectionSync,
  ReadOnlyModelSync: ReadOnlyModelSync,
  ReadOnlyRootCollectionSync: ReadOnlyRootCollectionSync,
  ReadOnlyChildCollectionSync: ReadOnlyChildCollectionSync,
  CommandObjectSync: CommandObjectSync,

  dataTypes: dataTypes,
  commonRules: commonRules,
  daoBuilder: daoBuilder,
  shared: shared,
  rules: rules
};

module.exports = businessObjects;
