'use strict';

//region Imports

var EditableRootObject = require('./editable-root-object.js');
var EditableChildObject = require('./editable-child-object.js');
var EditableRootCollection = require('./editable-root-collection.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyRootObject = require('./read-only-root-object.js');
var ReadOnlyChildObject = require('./read-only-child-object.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

var PropertyManager = require('./shared/property-manager.js');
var RuleManager = require('./rules/rule-manager.js');
var ExtensionManager = require('./shared/extension-manager.js');

var Action = require('./rules/authorization-action.js');
var cr = require('./common-rules/index.js');

var PropertyInfo = require('./shared/property-info.js');
var dt = require('./data-types/index.js');

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

  var self = this;
  var modelType = null;
  var itemsType = null;
  var argsType = null;
  var properties = null;
  var rules = null;
  var extensions = null;
  var currentProperty = null;

  //region Model types

  this.editableRootObject = function (dataSource, modelPath) {
    modelType = EditableRootObject;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.editableChildObject = function (dataSource, modelPath) {
    modelType = EditableChildObject;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyRootObject = function (dataSource, modelPath) {
    modelType = ReadOnlyRootObject;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyChildObject = function (dataSource, modelPath) {
    modelType = ReadOnlyChildObject;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  this.editableRootCollection = function (dataSource, modelPath) {
    modelType = EditableRootCollection;
    argsType = ArgsType.rootCollection;
    return initialize(dataSource, modelPath);
  };

  this.editableChildCollection = function () {
    modelType = EditableChildCollection;
    argsType = ArgsType.childCollection;
    return initialize();
  };

  this.readOnlyRootCollection = function (dataSource, modelPath) {
    modelType = ReadOnlyRootCollection;
    argsType = ArgsType.rootCollection;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyChildCollection = function () {
    modelType = ReadOnlyChildCollection;
    argsType = ArgsType.childCollection;
    return initialize();
  };

  this.commandObject = function (dataSource, modelPath) {
    modelType = CommandObject;
    argsType = ArgsType.businessObject;
    return initialize(dataSource, modelPath);
  };

  function initialize (dataSource, modelPath) {
    if (argsType === ArgsType.businessObject)
      properties = new PropertyManager();
    if (argsType !== ArgsType.childCollection) {
      rules = new RuleManager();
      extensions = new ExtensionManager(dataSource, modelPath);
    }
    return self;
  }

  //endregion

  this.itemType = function (itemType) {
    itemsType = itemType;
    return this;
  };

  //region Properties

  this.boolean = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.Boolean, flags, getter, setter);
  };

  this.text = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.Text, flags, getter, setter);
  };

  this.email = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.Email, flags, getter, setter);
  };

  this.integer = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.Integer, flags, getter, setter);
  };

  this.decimal = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.Decimal, flags, getter, setter);
  };

  this.enum = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.Enum, flags, getter, setter);
  };

  this.dateTime = function (propertyName, flags, getter, setter) {
    return addProperty(propertyName, dt.DateTime, flags, getter, setter);
  };

  this.property = function (propertyName, typeCtor, flags, getter, setter) {
    return addProperty(propertyName, typeCtor, flags, getter, setter);
  };

  function addProperty (propertyName, propertyType, flags, getter, setter) {
    var property = new PropertyInfo(propertyName, propertyType, flags, getter, setter);
    properties.add(property);
    currentProperty = property;
    return self;
  }

  //endregion

  //region Property rules

  this.required = function (/* message, priority, stopsProcessing */) {
    return addValRule(cr.required, arguments);
  };

  this.maxLength = function (/* maxLength, message, priority, stopsProcessing */) {
    return addValRule(cr.maxLength, arguments);
  };

  this.minLength = function (/* minLength, message, priority, stopsProcessing */) {
    return addValRule(cr.minLength, arguments);
  };

  this.lengthIs = function (/* length, message, priority, stopsProcessing */) {
    return addValRule(cr.lengthIs, arguments);
  };

  this.maxValue = function (/* maxValue, message, priority, stopsProcessing */) {
    return addValRule(cr.maxValue, arguments);
  };

  this.minValue = function (/* minValue, message, priority, stopsProcessing */) {
    return addValRule(cr.minValue, arguments);
  };

  this.expression = function (/* regex, option, message, priority, stopsProcessing */) {
    return addValRule(cr.expression, arguments);
  };

  this.dependency = function (/* dependencies, message, priority, stopsProcessing */) {
    return addValRule(cr.dependency, arguments);
  };

  this.information = function (/* message, priority, stopsProcessing */) {
    return addValRule(cr.information, arguments);
  };

  function addValRule (ruleFactory, parameters) {
    if (!currentProperty)
      throw new Error('The current property is undefinable.');
    var args = Array.prototype.slice.call(parameters);
    args.unshift(currentProperty);
    rules.add(ruleFactory.apply(null, args));
    return self;
  }

  this.addValidation = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (!currentProperty)
      throw new Error('The current property is undefinable.');
    var args = Array.prototype.slice.call(parameters);
    var ruleFactory = args.shift();
    args.unshift(currentProperty);
    rules.add(ruleFactory.apply(null, args));
    return this;
  };

  this.canRead = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addAuthRule(Action.readProperty, arguments);
  };

  this.canWrite = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addAuthRule(Action.writeProperty, arguments);
  };

  function addAuthRule (action, parameters) {
    if (!currentProperty)
      throw new Error('The current property is undefinable.');
    var args = Array.prototype.slice.call(parameters);
    var ruleFactory = args.shift();
    args.unshift(action, currentProperty);
    rules.add(ruleFactory.apply(null, args));
    return self;
  }

  //endregion

  //region Object rules

  this.canCreate = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addObjRule(Action.createObject, arguments);
  };

  this.canFetch = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addObjRule(Action.fetchObject, arguments);
  };

  this.canUpdate = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addObjRule(Action.updateObject, arguments);
  };

  this.canRemove = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addObjRule(Action.removeObject, arguments);
  };

  this.canExecute = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    return addObjRule(Action.fetchObject, arguments);
  };

  function addObjRule (action, parameters) {
    var args = Array.prototype.slice.call(parameters);
    var ruleFactory = args.shift();
    args.unshift(action, null);
    rules.add(ruleFactory.apply(null, args));
    return nonProperty();
  }

  //endregion

  //region Extensions

  this.daoBuilder = function (daoBuilder) {
    extensions.daoBuilder = daoBuilder;
    return nonProperty();
  };

  this.toDto = function (toDto) {
    extensions.toDto = toDto;
    return nonProperty();
  };

  this.fromDto = function (fromDto) {
    extensions.fromDto = fromDto;
    return nonProperty();
  };

  this.toCto = function (toCto) {
    extensions.toCto = toCto;
    return nonProperty();
  };

  this.fromCto = function (fromCto) {
    extensions.fromCto = fromCto;
    return nonProperty();
  };

  this.dataCreate = function (dataCreate) {
    extensions.dataCreate = dataCreate;
    return nonProperty();
  };

  this.dataFetch = function (dataFetch) {
    extensions.dataFetch = dataFetch;
    return nonProperty();
  };

  this.dataInsert = function (dataInsert) {
    extensions.dataInsert = dataInsert;
    return nonProperty();
  };

  this.dataUpdate = function (dataUpdate) {
    extensions.dataUpdate = dataUpdate;
    return nonProperty();
  };

  this.dataRemove = function (dataRemove) {
    extensions.dataRemove = dataRemove;
    return nonProperty();
  };

  this.dataExecute = function (dataExecute) {
    extensions.dataExecute = dataExecute;
    return nonProperty();
  };

  this.addOtherMethod = function (methodName) {
    extensions.addOtherMethod(methodName);
    return nonProperty();
  };

  //endregion

  function nonProperty () {
    currentProperty = null;
    return self;
  }

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

module.exports = ModelComposerFactory;
