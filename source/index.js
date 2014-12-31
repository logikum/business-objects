'use strict';

var EditableModel = require('./editable-model.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyRootModel = require('./read-only-root-model.js');
var ReadOnlyChildModel = require('./read-only-child-model.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

var EditableRootModelSync = require('./editable-root-model-sync.js');
var EditableChildModelSync = require('./editable-child-model-sync.js');
var EditableChildCollectionSync = require('./editable-child-collection-sync.js');
var ReadOnlyRootModelSync = require('./read-only-root-model-sync.js');
var ReadOnlyChildModelSync = require('./read-only-child-model-sync.js');
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
  ReadOnlyRootModel: ReadOnlyRootModel,
  ReadOnlyChildModel: ReadOnlyChildModel,
  ReadOnlyRootCollection: ReadOnlyRootCollection,
  ReadOnlyChildCollection: ReadOnlyChildCollection,
  CommandObject: CommandObject,

  EditableRootModelSync: EditableRootModelSync,
  EditableChildModelSync: EditableChildModelSync,
  EditableChildCollectionSync: EditableChildCollectionSync,
  ReadOnlyRootModelSync: ReadOnlyRootModelSync,
  ReadOnlyChildModelSync: ReadOnlyChildModelSync,
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
