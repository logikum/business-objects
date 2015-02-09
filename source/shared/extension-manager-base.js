'use strict';

var CLASS_NAME = 'ExtensionManager';

var EnsureArgument = require('./../system/ensure-argument.js');
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

  /**
   * The name of the data source.
   * @type {string}
   * @readonly
   */
  this.dataSource = EnsureArgument.isMandatoryString(dataSource,
      'c_manString', CLASS_NAME, 'dataSource');
  /**
   * The path of the model definition.
   * @type {string}
   * @readonly
   */
  this.modelPath = EnsureArgument.isMandatoryString(modelPath,
      'c_manString', CLASS_NAME, 'modelPath');
  addArgs = EnsureArgument.isMandatoryInteger(addArgs,
      'c_manInteger', CLASS_NAME, 'addArgs');

  var self = this;
  var methods = {};
  var definitions = [
    { name: 'daoBuilder',  length: 2 },
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
   * @type {function}
   * @readonly
   */
  /**
   * Converts the model instance to data transfer object.
   * @name bo.shared.ExtensionManagerBase#toDto
   * @type {function}
   * @readonly
   */
  /**
   * Converts the data transfer object to model instance.
   * @name bo.shared.ExtensionManagerBase#fromDto
   * @type {function}
   * @readonly
   */
  /**
   * Converts the model instance to client transfer object.
   * @name bo.shared.ExtensionManagerBase#toCto
   * @type {function}
   * @readonly
   */
  /**
   * Converts the client transfer object to model instance.
   * @name bo.shared.ExtensionManagerBase#fromCto
   * @type {function}
   * @readonly
   */
  /**
   * Returns the property values of a new instance from the data source.
   * @name bo.shared.ExtensionManagerBase#dataCreate
   * @type {function}
   * @readonly
   */
  /**
   * Returns the property values of an existing instance from the data source.
   * @name bo.shared.ExtensionManagerBase#dataFetch
   * @type {function}
   * @readonly
   */
  /**
   * Saves a new instance into the data source.
   * @name bo.shared.ExtensionManagerBase#dataInsert
   * @type {function}
   * @readonly
   */
  /**
   * Saves an existing instance into the data source.
   * @name bo.shared.ExtensionManagerBase#dataUpdate
   * @type {function}
   * @readonly
   */
  /**
   * Deletes an existing instance from the data source.
   * @name bo.shared.ExtensionManagerBase#dataRemove
   * @type {function}
   * @readonly
   */
  /**
   * Executes a command on the data source.
   * @name bo.shared.ExtensionManagerBase#dataExecute
   * @type {function}
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

  this.methods = [];

  // Immutable object.
  Object.freeze(this);
}

module.exports = ExtensionManagerBase;
