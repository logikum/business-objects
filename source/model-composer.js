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

var ComposerError = require('./system/composer-error.js');

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

  //region Variables

  var self = this;

  var modelFactory = null;
  var modelTypeName = null;
  var memberType = null;
  var argsType = null;
  var isCollection = null;
  var isRoot = null;
  var isEditable = null;

  var properties = null;
  var rules = null;
  var extensions = null;
  var currentProperty = null;

  //endregion

  //region Model types

  this.editableRootObject = function (dataSource, modelPath) {
    modelFactory = EditableRootObject;
    modelTypeName = 'EditableRootObject';
    argsType = ArgsType.businessObject;
    isCollection = false;
    isRoot = true;
    isEditable = true;
    return initialize(dataSource, modelPath);
  };

  this.editableChildObject = function (dataSource, modelPath) {
    modelFactory = EditableChildObject;
    modelTypeName = 'EditableChildObject';
    argsType = ArgsType.businessObject;
    isCollection = false;
    isRoot = false;
    isEditable = true;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyRootObject = function (dataSource, modelPath) {
    modelFactory = ReadOnlyRootObject;
    modelTypeName = 'ReadOnlyRootObject';
    argsType = ArgsType.businessObject;
    isCollection = false;
    isRoot = true;
    isEditable = false;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyChildObject = function (dataSource, modelPath) {
    modelFactory = ReadOnlyChildObject;
    modelTypeName = 'ReadOnlyChildObject';
    argsType = ArgsType.businessObject;
    isCollection = false;
    isRoot = false;
    isEditable = false;
    return initialize(dataSource, modelPath);
  };

  this.editableRootCollection = function (dataSource, modelPath) {
    modelFactory = EditableRootCollection;
    modelTypeName = 'EditableRootCollection';
    argsType = ArgsType.rootCollection;
    isCollection = true;
    isRoot = true;
    isEditable = true;
    return initialize(dataSource, modelPath);
  };

  this.editableChildCollection = function () {
    modelFactory = EditableChildCollection;
    modelTypeName = 'EditableChildCollection';
    argsType = ArgsType.childCollection;
    isCollection = true;
    isRoot = false;
    isEditable = true;
    return initialize();
  };

  this.readOnlyRootCollection = function (dataSource, modelPath) {
    modelFactory = ReadOnlyRootCollection;
    modelTypeName = 'ReadOnlyRootCollection';
    argsType = ArgsType.rootCollection;
    isCollection = true;
    isRoot = true;
    isEditable = false;
    return initialize(dataSource, modelPath);
  };

  this.readOnlyChildCollection = function () {
    modelFactory = ReadOnlyChildCollection;
    modelTypeName = 'ReadOnlyChildCollection';
    argsType = ArgsType.childCollection;
    isCollection = true;
    isRoot = false;
    isEditable = false;
    return initialize();
  };

  this.commandObject = function (dataSource, modelPath) {
    modelFactory = CommandObject;
    modelTypeName = 'CommandObject';
    argsType = ArgsType.businessObject;
    isCollection = false;
    isRoot = true;
    isEditable = true;
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

  //region Collections

  this.itemType = function (itemType) {
    if (!isCollection)
      invalid('itemType');
    memberType = itemType;
    return this;
  };

  //endregion

  //region Properties

  this.boolean = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('boolean');
    return addProperty(propertyName, dt.Boolean, flags, getter, setter);
  };

  this.text = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('text');
    return addProperty(propertyName, dt.Text, flags, getter, setter);
  };

  this.email = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('email');
    return addProperty(propertyName, dt.Email, flags, getter, setter);
  };

  this.integer = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('integer');
    return addProperty(propertyName, dt.Integer, flags, getter, setter);
  };

  this.decimal = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('decimal');
    return addProperty(propertyName, dt.Decimal, flags, getter, setter);
  };

  this.enum = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('enum');
    return addProperty(propertyName, dt.Enum, flags, getter, setter);
  };

  this.dateTime = function (propertyName, flags, getter, setter) {
    if (isCollection)
      invalid('dateTime');
    return addProperty(propertyName, dt.DateTime, flags, getter, setter);
  };

  this.property = function (propertyName, typeCtor, flags, getter, setter) {
    if (isCollection)
      invalid('property');
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
    if (isCollection)
      invalid('required');
    checkCurrentProperty('required');
    return addValRule(cr.required, arguments);
  };

  this.maxLength = function (/* maxLength, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('maxLength');
    checkCurrentProperty('maxLength');
    return addValRule(cr.maxLength, arguments);
  };

  this.minLength = function (/* minLength, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('minLength');
    checkCurrentProperty('minLength');
    return addValRule(cr.minLength, arguments);
  };

  this.lengthIs = function (/* length, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('lengthIs');
    checkCurrentProperty('lengthIs');
    return addValRule(cr.lengthIs, arguments);
  };

  this.maxValue = function (/* maxValue, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('maxValue');
    checkCurrentProperty('maxValue');
    return addValRule(cr.maxValue, arguments);
  };

  this.minValue = function (/* minValue, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('minValue');
    checkCurrentProperty('minValue');
    return addValRule(cr.minValue, arguments);
  };

  this.expression = function (/* regex, option, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('expression');
    checkCurrentProperty('expression');
    return addValRule(cr.expression, arguments);
  };

  this.dependency = function (/* dependencies, message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('dependency');
    checkCurrentProperty('dependency');
    return addValRule(cr.dependency, arguments);
  };

  this.information = function (/* message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('information');
    checkCurrentProperty('information');
    return addValRule(cr.information, arguments);
  };

  function addValRule (ruleFactory, parameters) {
    var args = Array.prototype.slice.call(parameters);
    args.unshift(currentProperty);
    rules.add(ruleFactory.apply(null, args));
    return self;
  }

  this.validate = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('validate');
    checkCurrentProperty('validate');
    var args = Array.prototype.slice.call(parameters);
    var ruleFactory = args.shift();
    args.unshift(currentProperty);
    rules.add(ruleFactory.apply(null, args));
    return this;
  };

  this.canRead = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (isCollection)
      invalid('canRead');
    checkCurrentProperty('canRead');
    return addAuthRule(Action.readProperty, arguments);
  };

  this.canWrite = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (isCollection || !isEditable)
      invalid('canWrite');
    checkCurrentProperty('canWrite');
    return addAuthRule(Action.writeProperty, arguments);
  };

  function addAuthRule (action, parameters) {
    var args = Array.prototype.slice.call(parameters);
    var ruleFactory = args.shift();
    args.unshift(action, currentProperty);
    rules.add(ruleFactory.apply(null, args));
    return self;
  }

  //endregion

  //region Object rules

  this.canCreate = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (!inGroup1())
      invalid('canCreate');
    return addObjRule(Action.createObject, arguments);
  };

  this.canFetch = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (inGroup2())
      invalid('canFetch');
    return addObjRule(Action.fetchObject, arguments);
  };

  this.canUpdate = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (!inGroup1())
      invalid('canUpdate');
    return addObjRule(Action.updateObject, arguments);
  };

  this.canRemove = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (!inGroup1())
      invalid('canRemove');
    return addObjRule(Action.removeObject, arguments);
  };

  this.canExecute = function (/* ruleFactory, [params], message, priority, stopsProcessing */) {
    if (modelFactory !== CommandObject)
      invalid('canExecute');
    return addObjRule(Action.executeCommand, arguments);
  };

  function addObjRule (action, parameters) {
    var args = Array.prototype.slice.call(parameters);
    var ruleFactory = args.shift();
    args.unshift(action, null);
    rules.add(ruleFactory.apply(null, args));
    return nonProperty();
  }

  this.canCall = function (/* methodName, ruleFactory, [params], message, priority, stopsProcessing */) {
    if (isCollection && !isRoot)
      invalid('canCall');
    var args = Array.prototype.slice.call(arguments);
    var methodName = args.shift();
    var ruleFactory = args.shift();
    args.unshift(Action.executeMethod, methodName);
    rules.add(ruleFactory.apply(null, args));
    return nonProperty();
  };

  //endregion

  //region Extensions

  this.daoBuilder = function (daoBuilder) {
    if (!isRoot && modelFactory !== EditableChildObject)
      invalid('daoBuilder');
    extensions.daoBuilder = daoBuilder;
    return nonProperty();
  };

  this.toDto = function (toDto) {
    if (!isEditable || isCollection)
      invalid('toDto');
    extensions.toDto = toDto;
    return nonProperty();
  };

  this.fromDto = function (fromDto) {
    if (isCollection)
      invalid('fromDto');
    extensions.fromDto = fromDto;
    return nonProperty();
  };

  this.toCto = function (toCto) {
    if (inGroup2())
      invalid('toCto');
    extensions.toCto = toCto;
    return nonProperty();
  };

  this.fromCto = function (fromCto) {
    if (!inGroup1())
      invalid('fromCto');
    extensions.fromCto = fromCto;
    return nonProperty();
  };

  this.dataCreate = function (dataCreate) {
    if (!inGroup3())
      invalid('dataCreate');
    extensions.dataCreate = dataCreate;
    return nonProperty();
  };

  this.dataFetch = function (dataFetch) {
    if (inGroup2())
      invalid('dataFetch');
    extensions.dataFetch = dataFetch;
    return nonProperty();
  };

  this.dataInsert = function (dataInsert) {
    if (!inGroup3())
      invalid('dataInsert');
    extensions.dataInsert = dataInsert;
    return nonProperty();
  };

  this.dataUpdate = function (dataUpdate) {
    if (!inGroup3())
      invalid('dataUpdate');
    extensions.dataUpdate = dataUpdate;
    return nonProperty();
  };

  this.dataRemove = function (dataRemove) {
    if (!inGroup3())
      invalid('dataRemove');
    extensions.dataRemove = dataRemove;
    return nonProperty();
  };

  this.dataExecute = function (dataExecute) {
    if (modelFactory !== CommandObject)
      invalid('dataExecute');
    extensions.dataExecute = dataExecute;
    return nonProperty();
  };

  this.addMethod = function (methodName) {
    if (modelFactory !== CommandObject)
      invalid('addMethod');
    extensions.addOtherMethod(methodName);
    return nonProperty();
  };

  //endregion

  //region Helper

  function nonProperty () {
    currentProperty = null;
    return self;
  }

  function inGroup1() {
    return [EditableRootObject, EditableChildObject, EditableRootCollection].some(function (element) {
      return element === modelFactory;
    });
  }

  function inGroup2() {
    return isCollection && !isRoot || modelFactory === CommandObject;
  }

  function inGroup3() {
    return modelFactory === EditableRootObject || modelFactory === EditableChildObject;
  }

  function checkCurrentProperty(methodName) {
    if (!currentProperty) {
      var error = new ComposerError('property', modelName, methodName);
      error.model = modelName;
      error.modelType = modelTypeName;
      error.method = methodName;
      throw error;
    }
  }

  function invalid(methodName) {
    var error = new ComposerError('invalid', modelName, methodName, modelTypeName);
    error.model = modelName;
    error.modelType = modelTypeName;
    error.method = methodName;
    throw error;
  }

  //endregion

  this.compose = function () {
    switch (argsType) {
      case ArgsType.businessObject:
        return new modelFactory(modelName, properties, rules, extensions);
      case ArgsType.rootCollection:
        return new modelFactory(modelName, memberType, rules, extensions);
      case ArgsType.childCollection:
        return new modelFactory(modelName, memberType);
    }
  };
}

module.exports = ModelComposerFactory;
