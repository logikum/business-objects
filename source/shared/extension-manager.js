'use strict';

var CLASS_NAME = 'ExtensionManager';

var config = require('./configuration-reader.js');
var Argument = require('../system/argument-check.js');
var ModelError = require('./model-error.js');
var DataPortalContext = require('../shared/data-portal-context.js');

/**
 * @classdesc
 *    Provides properties to customize models' behavior.
 * @description
 *    Creates a new extension manager object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} dataSource - The name of the data source.
 * @param {string} modelPath - The full path of the model.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The data source must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The model path must be a non-empty string.
 */
function ExtensionManager( dataSource, modelPath ) {
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

  //region Properties for the custom methods

  var self = this;
  var methods = {};
  var definitions = [
    { name: 'daoBuilder',  length: 3 },
    { name: 'toDto',       length: 1 },
    { name: 'fromDto',     length: 2 },
    { name: 'toCto',       length: 1 },
    { name: 'fromCto',     length: 2 },
    { name: 'dataCreate',  length: 1 },
    { name: 'dataFetch',   length: 3 },
    { name: 'dataInsert',  length: 1 },
    { name: 'dataUpdate',  length: 1 },
    { name: 'dataRemove',  length: 1 },
    { name: 'dataExecute', length: 2 }
  ];

  /**
   * Factory method to create the data access object for a model instance.
   * @name bo.shared.ExtensionManager#daoBuilder
   * @type {external.daoBuilder}
   * @readonly
   */
  /**
   * Converts the model instance to data transfer object.
   * @name bo.shared.ExtensionManager#toDto
   * @type {external.toDto}
   * @readonly
   */
  /**
   * Converts the data transfer object to model instance.
   * @name bo.shared.ExtensionManager#fromDto
   * @type {external.fromDto}
   * @readonly
   */
  /**
   * Converts the model instance to client transfer object.
   * @name bo.shared.ExtensionManager#toCto
   * @type {external.toCto}
   * @readonly
   */
  /**
   * Converts the client transfer object to model instance.
   * @name bo.shared.ExtensionManager#fromCto
   * @type {external.fromCto}
   * @readonly
   */
  /**
   * Returns the property values of a new instance from the data source.
   * @name bo.shared.ExtensionManager#dataCreate
   * @type {external.dataCreate}
   * @readonly
   */
  /**
   * Returns the property values of an existing instance from the data source.
   * @name bo.shared.ExtensionManager#dataFetch
   * @type {external.dataFetch}
   * @readonly
   */
  /**
   * Saves a new instance into the data source.
   * @name bo.shared.ExtensionManager#dataInsert
   * @type {external.dataInsert}
   * @readonly
   */
  /**
   * Saves an existing instance into the data source.
   * @name bo.shared.ExtensionManager#dataUpdate
   * @type {external.dataUpdate}
   * @readonly
   */
  /**
   * Deletes an existing instance from the data source.
   * @name bo.shared.ExtensionManager#dataRemove
   * @type {external.dataRemove}
   * @readonly
   */
  /**
   * Executes a command on the data source.
   * @name bo.shared.ExtensionManager#dataExecute
   * @type {external.dataExecute}
   * @readonly
   */
  definitions.map( function(definition) {
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

  //endregion

  //region Command object extensions

  var otherMethods = [];

  /**
   * Adds a new instance method to the model.
   * (The method will call a custom execute method on a command object instance.)
   *
   * @function bo.shared.ExtensionManager#addOtherMethod
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
   * @function bo.shared.ExtensionManager#buildOtherMethods
   * @protected
   * @param {ModelBase} instance - An instance of the model.
   */
  this.buildOtherMethods = function (instance) {
    if (otherMethods) {
      otherMethods.map(function (definition) {
        instance[definition.name] = function () {
          return instance.execute(definition.name, definition.trx);
        };
      });
    }
  };

  //endregion

  /**
   * Gets the data access object instance of the model.
   *
   * @function bo.shared.ExtensionManager#getDataAccessObject
   * @protected
   * @param {string} modelName - The name of the model.
   * @returns {bo.dataAccess.DaoBase} The data access object instance of the model.
   */
  this.getDataAccessObject = function (modelName) {
    return self.daoBuilder ?
        self.daoBuilder(dataSource, modelPath, modelName) :
        config.daoBuilder(dataSource, modelPath, modelName);
  };

  /**
   * Executes a custom data portal method.
   *
   * @param {string} methodName - The short name of the data portal method to execute.
   * @param {object} thisArg - The business object that executes the data portal method.
   *      E.g. 'update' for 'dataUpdate'.
   * @param {bo.shared.DataPortalContext} dpContext - Tha data portal context
   *      of the custom data portal method.
   * @param {...*} [dpParams] - More optional parameters of the data portal method.
   * @returns {Promise<object>} A promise to the result of the custom data portal method.
   */
  this.$runMethod = function( methodName, thisArg, dpContext, dpParams) {
    var check = Argument.inMethod( CLASS_NAME, '$runMethod' );

    methodName = check( methodName ).forMandatory( 'methodName' ).asString();
    thisArg = check( thisArg ).forMandatory( 'thisArg' ).asObject();
    dpContext = check( dpContext ).forMandatory( 'dpContext' ).asType( DataPortalContext );

    methodName = 'data' + methodName[0].toUpperCase() + methodName.substr(1);
    if ( methods[ methodName ]) {

      // Remove method name and execution context from arguments.
      var args = Array.prototype.slice.call( arguments ).slice( 2 );

      // Execute the custom data portal method.
      return new Promise( (fulfill, reject) => {
        dpContext.setPromise( fulfill, reject );
        methods[ methodName ].apply( thisArg, args );
      });
    }
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = ExtensionManager;
