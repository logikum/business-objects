'use strict';

var CLASS_NAME = 'ExtensionManager';

var config = require('./configuration-reader.js');
var Argument = require('../system/argument-check.js');
var ModelError = require('./model-error.js');

/**
 * @classdesc
 *    Provides properties to customize models' behavior.
 * @description
 *    Creates a new base extension manager object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} dataSource - The name of the data source.
 * @param {string} modelPath - The full path of the model.
 * @param {number} addArgs - The count of additional arguments for data portal methods of a model group.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The data source must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The model path must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The additional argument count must be an integer.
 */
function ExtensionManagerBase(dataSource, modelPath, addArgs) {
  var check = Argument.inConstructor(CLASS_NAME);

  /**
   * The name of the data source.
   * @type {string}
   * @readonly
   */
  this.dataSource = check(dataSource).forMandatory('dataSource').asString();
  /**
   * The path of the model definition.
   * @type {string}
   * @readonly
   */
  this.modelPath = check(modelPath).forMandatory('modelPath').asString();
  addArgs = check(addArgs).forMandatory('addArgs').asInteger();

  var self = this;
  var methods = {};
  var definitions = [
    { name: 'daoBuilder',  length: 3 },
    { name: 'toDto',       length: 1 },
    { name: 'fromDto',     length: 2 },
    { name: 'toCto',       length: 1 },
    { name: 'fromCto',     length: 2 },
    { name: 'dataCreate',  length: 0 + addArgs },
    { name: 'dataFetch',   length: 2 + addArgs },
    { name: 'dataInsert',  length: 0 + addArgs },
    { name: 'dataUpdate',  length: 0 + addArgs },
    { name: 'dataRemove',  length: 0 + addArgs },
    { name: 'dataExecute', length: 1 + addArgs }
  ];

  /**
   * Factory method to create the data access object for a model instance.
   * @name bo.shared.ExtensionManagerBase#daoBuilder
   * @type {external.daoBuilder}
   * @readonly
   */
  /**
   * Converts the model instance to data transfer object.
   * @name bo.shared.ExtensionManagerBase#toDto
   * @type {external.toDto}
   * @readonly
   */
  /**
   * Converts the data transfer object to model instance.
   * @name bo.shared.ExtensionManagerBase#fromDto
   * @type {external.fromDto}
   * @readonly
   */
  /**
   * Converts the model instance to client transfer object.
   * @name bo.shared.ExtensionManagerBase#toCto
   * @type {external.toCto}
   * @readonly
   */
  /**
   * Converts the client transfer object to model instance.
   * @name bo.shared.ExtensionManagerBase#fromCto
   * @type {external.fromCto}
   * @readonly
   */
  /**
   * Returns the property values of a new instance from the data source.
   * @name bo.shared.ExtensionManagerBase#dataCreate
   * @type {external.dataCreate}
   * @readonly
   */
  /**
   * Returns the property values of an existing instance from the data source.
   * @name bo.shared.ExtensionManagerBase#dataFetch
   * @type {external.dataFetch}
   * @readonly
   */
  /**
   * Saves a new instance into the data source.
   * @name bo.shared.ExtensionManagerBase#dataInsert
   * @type {external.dataInsert}
   * @readonly
   */
  /**
   * Saves an existing instance into the data source.
   * @name bo.shared.ExtensionManagerBase#dataUpdate
   * @type {external.dataUpdate}
   * @readonly
   */
  /**
   * Deletes an existing instance from the data source.
   * @name bo.shared.ExtensionManagerBase#dataRemove
   * @type {external.dataRemove}
   * @readonly
   */
  /**
   * Executes a command on the data source.
   * @name bo.shared.ExtensionManagerBase#dataExecute
   * @type {external.dataExecute}
   * @readonly
   */
  definitions.map(function(definition) {
    methods[definition.name] = null;

    Object.defineProperty(self, definition.name, {
      get: function () {
        return methods[definition.name];
      },
      set: function (value) {
        if (value && typeof value === 'function' && value.length == definition.length)
          methods[definition.name] = value;
        else
          switch (definition.length) {
            case 0:
              throw new ModelError('propertyArg0', CLASS_NAME, definition.name);
            case 1:
              throw new ModelError('propertyArg1', CLASS_NAME, definition.name);
            default:
              throw new ModelError('propertyArgN', CLASS_NAME, definition.name, definition.length);
          }
      },
      enumerable: true
    });
  });

  //region Command object extensions

  var otherMethods = [];

  /**
   * Adds a new instance method to the model.
   * (The method will call a custom execute method on a command object instance.)
   *
   * @function bo.shared.ExtensionManagerBase#addOtherMethod
   * @param {string} methodName - The name of the method on the data access object to be called.
   * @param {boolean} [isTransaction] - Indicates whether transaction is required.
   */
  this.addOtherMethod = function (methodName, isTransaction) {
    methodName = Argument.inMethod(CLASS_NAME, 'addOtherMethod')
        .check(methodName).forMandatory('methodName').asString();
    isTransaction = isTransaction || false;

    otherMethods.push({ name: methodName, trx: isTransaction });
  };

  /**
   * Instantiate the defined custom methods on the model instance.
   * (The method is currently used by command objects only.)
   *
   * @function bo.shared.ExtensionManagerBase#buildOtherMethods
   * @protected
   * @param {ModelBase} instance - An instance of the model.
   * @param {boolean} isSync - Indicates whether the model is synchronous or asynchronous.
   */
  this.buildOtherMethods = function (instance, isSync) {
    if (otherMethods) {
      if (isSync)
        otherMethods.map(function (methodDef) {
          instance[methodDef.name] = function () {
            instance.execute(methodDef.name, methodDef.trx);
          };
        });
      else
        otherMethods.map(function (methodDef) {
          instance[methodDef.name] = function (callback) {
            instance.execute(methodDef.name, methodDef.trx, callback);
          };
        });
    }
  };

  //endregion

  /**
   * Gets the data access object instance of the model.
   *
   * @function bo.shared.ExtensionManagerBase#getDataAccessObject
   * @protected
   * @param {string} modelName - The name of the model.
   * @returns {bo.dataAccess.DaoBase} The data access object instance of the model.
   */
  this.getDataAccessObject = function (modelName) {
    return self.daoBuilder ?
        self.daoBuilder(dataSource, modelPath, modelName) :
        config.daoBuilder(dataSource, modelPath, modelName);
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = ExtensionManagerBase;
