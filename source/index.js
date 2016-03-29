'use strict';

//region Imports

var ModelComposer = require('./model-composer.js');
var ModelComposerSync = require('./model-composer-sync.js');

var EditableRootObject = require('./editable-root-object.js');
var EditableChildObject = require('./editable-child-object.js');
var EditableRootCollection = require('./editable-root-collection.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyRootObject = require('./read-only-root-object.js');
var ReadOnlyChildObject = require('./read-only-child-object.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

var EditableRootObjectSync = require('./editable-root-object-sync.js');
var EditableChildObjectSync = require('./editable-child-object-sync.js');
var EditableRootCollectionSync = require('./editable-root-collection-sync.js');
var EditableChildCollectionSync = require('./editable-child-collection-sync.js');
var ReadOnlyRootObjectSync = require('./read-only-root-object-sync.js');
var ReadOnlyChildObjectSync = require('./read-only-child-object-sync.js');
var ReadOnlyRootCollectionSync = require('./read-only-root-collection-sync.js');
var ReadOnlyChildCollectionSync = require('./read-only-child-collection-sync.js');
var CommandObjectSync = require('./command-object-sync.js');

var commonRules = require('./common-rules/index.js');
var dataAccess = require('./data-access/index.js');
var dataTypes = require('./data-types/index.js');
var rules = require('./rules/index.js');
var shared = require('./shared/index.js');
var system = require('./system/index.js');

var configuration = require('./shared/configuration-reader.js');
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
  ModelComposerSync: ModelComposerSync,

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

  EditableRootObjectSync: EditableRootObjectSync,
  EditableChildObjectSync: EditableChildObjectSync,
  EditableRootCollectionSync: EditableRootCollectionSync,
  EditableChildCollectionSync: EditableChildCollectionSync,
  ReadOnlyRootObjectSync: ReadOnlyRootObjectSync,
  ReadOnlyChildObjectSync: ReadOnlyChildObjectSync,
  ReadOnlyRootCollectionSync: ReadOnlyRootCollectionSync,
  ReadOnlyChildCollectionSync: ReadOnlyChildCollectionSync,
  CommandObjectSync: CommandObjectSync,

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
