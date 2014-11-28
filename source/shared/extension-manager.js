'use strict';

var ensureArgument = require('./ensure-argument.js');

/**
 *
 * @param dataSource
 * @constructor
 *
 * dataSource   (string)      The name of the data source.
 * modelPath    (string)      The path of the model definition.
 * daoBuilder   (string)      Returns the data access object of the model for the data source.
 * toDto        (function)    Convert model instance to data transfer object.
 * fromDto      (function)    Convert data transfer object to model instance.
 * toCto        (function)    Convert model instance to client transfer object.
 * fromCto      (function)    Convert client transfer object to model instance.
 * dataCreate   (function)    Returns the property values of a new instance from the data source.
 * dataFetch    (function)    Returns the property values of an existing instance from the data source.
 * dataInsert   (function)    Saves a new instance in the data source.
 * dataUpdate   (function)    Saves an existing instance in the data source.
 * dataRemove   (function)    Deletes an existing instance from the data source.
 */
function ExtensionManager(dataSource, modelPath) {

  this.dataSource = ensureArgument.isMandatoryString(dataSource,
      'The dataSource argument of ExtensionManager constructor must be a  non-empty string.');
  this.modelPath = ensureArgument.isMandatoryString(modelPath,
      'The modelPath argument of ExtensionManager constructor must be a  non-empty string.');

  var self = this;
  var methods = {};
  var definitions = [
    { name: 'daoBuilder', length: 2 },
    { name: 'toDto',      length: 0 },
    { name: 'fromDto',    length: 1 },
    { name: 'toCto',      length: 0 },
    { name: 'fromCto',    length: 1 },
    { name: 'dataCreate', length: 1 },
    { name: 'dataFetch',  length: 2 },
    { name: 'dataInsert', length: 1 },
    { name: 'dataUpdate', length: 1 },
    { name: 'dataRemove', length: 1 }
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
        else {
          var message = 'The ' + definition.name + ' property of ExtensionManager expects a function ';
          switch (definition.length) {
            case 0:
              message += 'without arguments.';
              break;
            case 1:
              message += 'with 1 argument.';
              break;
            default:
              message += 'with ' + definition.length.toString() + ' arguments.';
              break;
          }
          throw new Error(message);
        }
      },
      enumerable: true
    });
  });

  // Immutable object.
  Object.freeze(this);
}

module.exports = ExtensionManager;
