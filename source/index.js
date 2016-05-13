'use strict';

//region Imports

var ModelComposer = require('./model-composer.js');

var EditableRootObject = require('./editable-root-object.js');
var EditableChildObject = require('./editable-child-object.js');
var EditableRootCollection = require('./editable-root-collection.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyRootObject = require('./read-only-root-object.js');
var ReadOnlyChildObject = require('./read-only-child-object.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

var commonRules = require('./common-rules/index.js');
var dataAccess = require('./data-access/index.js');
var dataTypes = require('./data-types/index.js');
var rules = require('./rules/index.js');
var shared = require('./shared/index.js');
var system = require('./system/index.js');

var configuration = require('./system/configuration-reader.js');
var i18n = require('./locales/i18n.js');

//endregion

/**
 * List of models and helper namespaces.
 *
 * @namespace bo
 *
 * @property {namespace} commonRules - {@link bo.commonRules Common rules namespace}
 *      contains frequently used rules.
 * @property {namespace} dataAccess - {@link bo.dataAccess Data access namespace}
 *      contains data access components.
 * @property {namespace} dataTypes - {@link bo.dataTypes Data types namespace}
 *      contains data type components and definitions.
 * @property {namespace} rules - {@link bo.rules Rules namespace}
 *      contains components of validation and authorization rules.
 * @property {namespace} shared - {@link bo.shared Shared namespace}
 *      contains components used by models, collections and other components.
 * @property {namespace} system - {@link bo.system System namespace}
 *      contains general components.
 *
 * @property {object} configuration - Object containing
 *      {@link bo.shared~configuration configuration} data of the business objects.
 * @property {function} i18n - {@link bo.i18n Internationalization}
 *      constructor to create new a message localizer object.
 */
var index = {
  ModelComposer: ModelComposer,

  //ModelBase: ModelBase,
  //CollectionBase: CollectionBase,

  EditableRootObject: EditableRootObject,
  EditableChildObject: EditableChildObject,
  EditableRootCollection: EditableRootCollection,
  EditableChildCollection: EditableChildCollection,
  ReadOnlyRootObject: ReadOnlyRootObject,
  ReadOnlyChildObject: ReadOnlyChildObject,
  ReadOnlyRootCollection: ReadOnlyRootCollection,
  ReadOnlyChildCollection: ReadOnlyChildCollection,
  CommandObject: CommandObject,

  commonRules: commonRules,
  dataAccess: dataAccess,
  dataTypes: dataTypes,
  rules: rules,
  shared: shared,
  system: system,

  configuration: configuration,
  i18n: i18n,

  /**
   * Initializes the business objects.
   *
   * @function bo.initialize
   * @param {string} cfgPath -
   *    The relative path of the {@link external.configurationFile configuration file} (.js or .json).
   *    E.g. /config/business-objects.json
   */
  initialize: function (cfgPath) {
    this.configuration.initialize(cfgPath);
    this.i18n.initialize(this.configuration.pathOfLocales, this.configuration.getLocale);
  }
};

// Immutable object.
Object.freeze(index);

module.exports = index;
