'use strict';

//var ModelBase = require('./model-base.js');
//var CollectionBase = require('./collection-base.js');

var EditableRootModel = require('./editable-root-model.js');
var EditableChildModel = require('./editable-child-model.js');
var EditableChildCollection = require('./editable-child-collection.js');
var ReadOnlyRootModel = require('./read-only-root-model.js');
var ReadOnlyChildModel = require('./read-only-child-model.js');
var ReadOnlyRootCollection = require('./read-only-root-collection.js');
var ReadOnlyChildCollection = require('./read-only-child-collection.js');
var CommandObject = require('./command-object.js');

var EditableRootModelSync = require('./editable-root-model-sync.js');
var EditableChildModelSync = require('./editable-child-model-sync.js');
var EditableChildCollectionSync = require('./editable-child-collection-sync.js');
var ReadOnlyRootModelSync = require('./read-only-root-model-sync.js');
var ReadOnlyChildModelSync = require('./read-only-child-model-sync.js');
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
 * @property {internal.configuration} configuration - Object containing
 *      {@link internal.configuration configuration data} of the business objects.
 * @property {function} i18n - {@link bo.i18n Internationalization}
 *      constructor to create new a message localizer object.
 */
var index = {
  //ModelBase: ModelBase,
  //CollectionBase: CollectionBase,

  EditableRootModel: EditableRootModel,
  EditableChildModel: EditableChildModel,
  EditableChildCollection: EditableChildCollection,
  ReadOnlyRootModel: ReadOnlyRootModel,
  ReadOnlyChildModel: ReadOnlyChildModel,
  ReadOnlyRootCollection: ReadOnlyRootCollection,
  ReadOnlyChildCollection: ReadOnlyChildCollection,
  CommandObject: CommandObject,

  EditableRootModelSync: EditableRootModelSync,
  EditableChildModelSync: EditableChildModelSync,
  EditableChildCollectionSync: EditableChildCollectionSync,
  ReadOnlyRootModelSync: ReadOnlyRootModelSync,
  ReadOnlyChildModelSync: ReadOnlyChildModelSync,
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
  i18n: i18n
};

// Immutable object.
Object.freeze(index);

module.exports = index;
