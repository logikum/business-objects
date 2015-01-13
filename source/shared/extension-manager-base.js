/**
 * Base extension manager module.
 * @module shared/extension-manager-base
 */
'use strict';

var ensureArgument = require('./ensure-argument.js');
var ModelError = require('./model-error.js');

/**
 *
 * @param dataSource
 * @constructor
 *
 * dataSource   string      The name of the data source.
 * modelPath    string      The path of the model definition.
 * daoBuilder   string      Returns the data access object of the model for the data source.
 * toDto        function    Convert model instance to data transfer object.
 * fromDto      function    Convert data transfer object to model instance.
 * toCto        function    Convert model instance to client transfer object.
 * fromCto      function    Convert client transfer object to model instance.
 * dataCreate   function    Returns the property values of a new instance from the data source.
 * dataFetch    function    Returns the property values of an existing instance from the data source.
 * dataInsert   function    Saves a new instance in the data source.
 * dataUpdate   function    Saves an existing instance in the data source.
 * dataRemove   function    Deletes an existing instance from the data source.
 * dataExecute  function    Executes a server side command.
 */
function ExtensionManagerBase(dataSource, modelPath, addArgs) {

  this.dataSource = ensureArgument.isMandatoryString(dataSource,
      'c_manString', 'ExtensionManager', 'dataSource');
  this.modelPath = ensureArgument.isMandatoryString(modelPath,
      'c_manString', 'ExtensionManager', 'modelPath');
  addArgs = ensureArgument.isMandatoryInteger(addArgs,
      'c_manInteger', 'ExtensionManager', 'addArgs');

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
              throw new ModelError('propertyArg0', 'ExtensionManager', definition.name);
            case 1:
              throw new ModelError('propertyArg1', 'ExtensionManager', definition.name);
            default:
              throw new ModelError('propertyArgN', 'ExtensionManager', definition.name, definition.length);
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
