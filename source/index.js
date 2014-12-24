'use strict';

var EditableModel = require('./editable-model.js');
var EditableCollection = require('./editable-collection.js');
var ReadOnlyModel = require('./read-only-model.js');
var ReadOnlyCollection = require('./read-only-collection.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');

var EditableModelSync = require('./editable-model-sync.js');
var EditableCollectionSync = require('./editable-collection-sync.js');
var ReadOnlyModelSync = require('./read-only-model-sync.js');
var ReadOnlyCollectionSync = require('./read-only-collection-sync.js');
var ReadOnlyRootCollectionSync = require('./read-only-root-collection-sync.js');

var dataTypes = require('./data-types/index.js');
var commonRules = require('./common-rules/index.js');
var daoBuilder = require('./data-access/dao-builder.js');
var shared = require('./shared/index.js');
var rules = require('./rules/index.js');

var businessObjects = {
  EditableModel: EditableModel,
  EditableCollection: EditableCollection,
  ReadOnlyModel: ReadOnlyModel,
  ReadOnlyCollection: ReadOnlyCollection,
  ReadOnlyRootCollection: ReadOnlyRootCollection,

  EditableModelSync: EditableModelSync,
  EditableCollectionSync: EditableCollectionSync,
  ReadOnlyModelSync: ReadOnlyModelSync,
  ReadOnlyCollectionSync: ReadOnlyCollectionSync,
  ReadOnlyRootCollectionSync: ReadOnlyRootCollectionSync,

  dataTypes: dataTypes,
  commonRules: commonRules,
  daoBuilder: daoBuilder,
  shared: shared,
  rules: rules
};

module.exports = businessObjects;
