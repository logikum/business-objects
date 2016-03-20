'use strict';

//region Imports

var PropertyManager = require('./shared/property-manager.js');
var RuleManager = require('./rules/rule-manager.js');
var ExtensionManager = require('./shared/extension-manager.js');
//var ExtensionManagerSync = require('./shared/extension-manager-sync.js');

var EditableRootModel = require('./editable-root-model.js');
var EditableChildModel = require('./editable-child-model.js');
var EditableRootCollection = require('./editable-root-collection.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyRootModel = require('./read-only-root-model.js');
var ReadOnlyChildModel = require('./read-only-child-model.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

//var EditableRootModelSync = require('./editable-root-model-sync.js');
//var EditableChildModelSync = require('./editable-child-model-sync.js');
//var EditableRootCollectionSync = require('./editable-root-collection-sync.js');
//var EditableChildCollectionSync = require('./editable-child-collection-sync.js');
//var ReadOnlyRootModelSync = require('./read-only-root-model-sync.js');
//var ReadOnlyChildModelSync = require('./read-only-child-model-sync.js');
//var ReadOnlyRootCollectionSync = require('./read-only-root-collection-sync.js');
//var ReadOnlyChildCollectionSync = require('./read-only-child-collection-sync.js');
//var CommandObjectSync = require('./command-object-sync.js');

//endregion

function ModelComposerFactory (modelName) {
  return new ModelComposer (modelName);
}

var ArgsType = {
  businessObject: 0,
  rootCollection: 1,
  childCollection: 2
};

function ModelComposer (modelName) {

  var modelType = null;
  var itemsType = null;
  var argsType = null;
  var properties = null;
  var rules = null;
  var extensions = null;

  //region Model types

  this.editableRootModel = function (dataSource, modelPath) {
    modelType = EditableRootModel;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.editableChildModel = function (dataSource, modelPath) {
    modelType = EditableChildModel;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyRootModel = function (dataSource, modelPath) {
    modelType = ReadOnlyRootModel;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyChildModel = function (dataSource, modelPath) {
    modelType = ReadOnlyChildModel;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.editableRootCollection = function (dataSource, modelPath) {
    modelType = EditableRootCollection;
    argsType = ArgsType.rootCollection;
    return initialize(dataSource, modelPath);
  };

  this.editableChildCollection = function (dataSource, modelPath) {
    modelType = EditableChildCollection;
    argsType = ArgsType.childCollection;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyRootCollection = function (dataSource, modelPath) {
    modelType = ReadOnlyRootCollection;
    argsType = ArgsType.rootCollection;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyChildCollection = function (dataSource, modelPath) {
    modelType = ReadOnlyChildCollection;
    argsType = ArgsType.childCollection;
    return initialize(dataSource, modelPath);
  };

  this.commandObject = function (dataSource, modelPath) {
    modelType = CommandObject;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  function initialize (dataSource, modelPath) {
    properties = new PropertyManager();
    rules = new RuleManager();
    extensions = new ExtensionManager(dataSource, modelPath);
    return this;
  }

  //endregion

  this.itemType = function (itemType) {
    itemsType = itemType;
    return this;
  };

  //region Properties

  //endregion

  //region Property rules

  //endregion

  //region Object rules

  //endregion

  //region Extensions

  this.daoBuilder = function (daoBuilder) {
    extensions.daoBuilder = daoBuilder;
    return this;
  };

  this.toDto = function (toDto) {
    extensions.toDto = toDto;
    return this;
  };

  this.fromDto = function (fromDto) {
    extensions.fromDto = fromDto;
    return this;
  };

  this.toCto = function (toCto) {
    extensions.toCto = toCto;
    return this;
  };

  this.fromCto = function (fromCto) {
    extensions.fromCto = fromCto;
    return this;
  };

  this.dataCreate = function (dataCreate) {
    extensions.dataCreate = dataCreate;
    return this;
  };

  this.dataFetch = function (dataFetch) {
    extensions.dataFetch = dataFetch;
    return this;
  };

  this.dataInsert = function (dataInsert) {
    extensions.dataInsert = dataInsert;
    return this;
  };

  this.dataUpdate = function (dataUpdate) {
    extensions.dataUpdate = dataUpdate;
    return this;
  };

  this.dataRemove = function (dataRemove) {
    extensions.dataRemove = dataRemove;
    return this;
  };

  this.dataExecute = function (dataExecute) {
    extensions.dataExecute = dataExecute;
    return this;
  };

  //endregion

  this.compose = function () {
    switch (argsType) {
      case ArgsType.businessObject:
        return new modelType(modelName, properties, rules, extensions);
      case ArgsType.rootCollection:
        return new modelType(modelName, itemsType, rules, extensions);
      case ArgsType.childCollection:
        return new modelType(modelName, itemsType);
    }
  };
}
//util.inherits(ModelComposer, ComposerBase);

module.exports = ModelBase;
