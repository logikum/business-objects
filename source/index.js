/*
 * Business objects' index module.
 */
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

var dataTypes = require('./data-types/index.js');
var shared = require('./shared/index.js');
var rules = require('./rules/index.js');
var commonRules = require('./common-rules/index.js');
var dataAccess = require('./data-access/index.js');
var i18n = require('./locales/i18n.js');

/**
 * List of models and helper namespaces.
 *
 * @namespace bo
 */
var index = {
  //ModelBase: ModelBase,
  //CollectionBase: CollectionBase,

  /**
   * Creator function for asynchronous editable root models.
   * @memberof bo
   * @see {@link module:editable-root-model} for further information.
   */
  EditableRootModel: EditableRootModel,
  /**
   * Creator function for asynchronous editable child models.
   * @memberof bo
   * @see {@link module:editable-child-model} for further information.
   */
  EditableChildModel: EditableChildModel,
  /**
   * Creator function for asynchronous editable child collections.
   * @memberof bo
   * @see {@link module:editable-child-collection} for further information.
   */
  EditableChildCollection: EditableChildCollection,
  /**
   * Creator function for asynchronous read-only root models.
   * @memberof bo
   * @see {@link module:read-only-root-model} for further information.
   */
  ReadOnlyRootModel: ReadOnlyRootModel,
  /**
   * Creator function for asynchronous read-only child models.
   * @memberof bo
   * @see {@link module:read-only-child-model} for further information.
   */
  ReadOnlyChildModel: ReadOnlyChildModel,
  /**
   * Creator function for asynchronous read-only root collections.
   * @memberof bo
   * @see {@link module:read-only-root-collection} for further information.
   */
  ReadOnlyRootCollection: ReadOnlyRootCollection,
  /**
   * Creator function for asynchronous read-only child collections.
   * @memberof bo
   * @see {@link module:read-only-child-collection} for further information.
   */
  ReadOnlyChildCollection: ReadOnlyChildCollection,
  /**
   * Creator function for asynchronous command objects.
   * @memberof bo
   * @see {@link module:command-object} for further information.
   */
  CommandObject: CommandObject,


  /**
   * Creator function for synchronous editable root models.
   * @memberof bo
   * @see {@link module:editable-root-model-sync} for further information.
   */
  EditableRootModelSync: EditableRootModelSync,
  /**
   * Creator function for synchronous editable child models.
   * @memberof bo
   * @see {@link module:editable-child-model-sync} for further information.
   */
  EditableChildModelSync: EditableChildModelSync,
  /**
   * Creator function for synchronous editable child collections.
   * @memberof bo
   * @see {@link module:editable-child-collection-sync} for further information.
   */
  EditableChildCollectionSync: EditableChildCollectionSync,
  /**
   * Creator function for synchronous read-only root models.
   * @memberof bo
   * @see {@link module:read-only-child-root-sync} for further information.
   */
  ReadOnlyRootModelSync: ReadOnlyRootModelSync,
  /**
   * Creator function for synchronous read-only child models.
   * @memberof bo
   * @see {@link module:read-only-child-model-sync} for further information.
   */
  ReadOnlyChildModelSync: ReadOnlyChildModelSync,
  /**
   * Creator function for synchronous read-only root collections.
   * @memberof bo
   * @see {@link module:read-only-root-collection-sync} for further information.
   */
  ReadOnlyRootCollectionSync: ReadOnlyRootCollectionSync,
  /**
   * Creator function for synchronous read-only child collections.
   * @memberof bo
   * @see {@link module:read-only-child-collection-sync} for further information.
   */
  ReadOnlyChildCollectionSync: ReadOnlyChildCollectionSync,
  /**
   * Creator function for synchronous command objects.
   * @memberof bo
   * @see {@link module:command-object-sync} for further information.
   */
  CommandObjectSync: CommandObjectSync,


  /**
   * List of data types.
   */
  dataTypes: dataTypes,
  /**
   * List of shared components.
   * @memberof bo
   * @see {@link bo/shared} for further information.
   */
  shared: shared,
  /**
   * List of rule components.
   * @memberof bo
   * @see {@link bo/rules} for further information.
   */
  rules: rules,
  /**
   * List of common rules.
   * @memberof bo
   * @see {@link bo/common-rules} for further information.
   */
  commonRules: commonRules,
  /**
   * List of data access components.
   * @memberof bo
   * @see {@link bo/data-access} for further information.
   */
  dataAccess: dataAccess,
  /**
   * Internationalization of business objects.
   * @memberof bo
   * @see {@link module:i18n} for further information.
   */
  i18n: i18n
};

// Immutable object.
Object.freeze(index);

module.exports = index;
