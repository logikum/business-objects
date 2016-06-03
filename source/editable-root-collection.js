'use strict';

//region Imports

const config = require( './system/configuration-reader.js' );
const Argument = require( './system/argument-check.js' );

const CollectionBase = require( './collection-base.js' );
const ModelType = require( './model-type.js' );
const ModelError = require( './shared/model-error.js' );
const ExtensionManager = require( './shared/extension-manager.js' );
const EventHandlerList = require( './shared/event-handler-list.js' );

const ClientTransferContext = require( './shared/client-transfer-context.js' );

const RuleManager = require( './rules/rule-manager.js' );
const BrokenRuleList = require( './rules/broken-rule-list.js' );
const AuthorizationAction = require( './rules/authorization-action.js' );
const AuthorizationContext = require( './rules/authorization-context.js' );
const BrokenRulesResponse = require( './rules/broken-rules-response.js' );

const DataPortalAction = require( './shared/data-portal-action.js' );
const DataPortalContext = require( './shared/data-portal-context.js' );
const DataPortalEvent = require( './shared/data-portal-event.js' );
const DataPortalEventArgs = require( './shared/data-portal-event-args.js' );
const DataPortalError = require( './shared/data-portal-error.js' );

//endregion

//region Private variables

const MODEL_STATE = require( './shared/model-state.js' );
const CLASS_NAME = 'EditableRootCollection';
const MODEL_DESC = 'Editable root collection';
const M_FETCH = DataPortalAction.getName( DataPortalAction.fetch );

const _itemType = new WeakMap();
const _rules = new WeakMap();
const _extensions = new WeakMap();
const _eventHandlers = new WeakMap();
const _state = new WeakMap();
const _isDirty = new WeakMap();
const _isValidated = new WeakMap();
const _brokenRules = new WeakMap();
const _dataContext = new WeakMap();
const _dao = new WeakMap();
const _items = new WeakMap();

//endregion

//region Helper methods

//region Mark object state

/*
 * From:         To:  | pri | cre | cha | mfr | rem
 * -------------------------------------------------
 * NULL               |  +  |  +  |  N  |  N  |  N
 * -------------------------------------------------
 * pristine           |  o  |  -  |  +  |  +  |  -
 * -------------------------------------------------
 * created            |  +  |  o  |  o  | (-) |  +
 * -------------------------------------------------
 * changed            |  +  |  -  |  o  |  +  |  -
 * -------------------------------------------------
 * markedForRemoval   |  -  |  -  |  o  |  o  |  +
 * -------------------------------------------------
 * removed            |  -  |  -  |  -  |  -  |  o
 * -------------------------------------------------
 *
 * Explanation:
 *   +  :  possible transition
 *   -  :  not allowed transition, throws exception
 *   o  :  no change, no action
 *   N  :  impossible start up, throws exception
 */

function markAsPristine() {
  const state = _state.get( this );
  if (state === MODEL_STATE.markedForRemoval || state === MODEL_STATE.removed)
    illegal.call( this, MODEL_STATE.pristine );
  else if (state !== MODEL_STATE.pristine) {
    _state.set( this, MODEL_STATE.pristine );
    _isDirty.set( this, false );
  }
}

function markAsCreated() {
  const state = _state.get( this );
  if (state === null) {
    _state.set( this, MODEL_STATE.created );
    _isDirty.set( this, true );
  }
  else if (state !== MODEL_STATE.created)
    illegal.call( this, MODEL_STATE.created );
}

function markAsChanged( itself ) {
  const state = _state.get( this );
  const isDirty = _isDirty.get( this );
  if (state === MODEL_STATE.pristine) {
    _state.set( this, MODEL_STATE.changed );
    _isDirty.set( this, isDirty || itself );
    _isValidated.set( this, false );
  }
  else if (state === MODEL_STATE.created) {
    _isDirty.set( this, isDirty || itself );
    _isValidated.set( this, false );
  }
  else if (state === MODEL_STATE.removed)
    illegal.call( this, MODEL_STATE.changed );
}

function markForRemoval() {
  const state = _state.get( this );
  if (state === MODEL_STATE.pristine || state === MODEL_STATE.changed) {
    _state.set( this, MODEL_STATE.markedForRemoval );
    _isDirty.set( this, true );
    propagateRemoval.call( this ); // down to children
  }
  else if (state === MODEL_STATE.created)
    _state.set( this, MODEL_STATE.removed );
  else if (state !== MODEL_STATE.markedForRemoval)
    illegal.call( this, MODEL_STATE.markedForRemoval );
}

function markAsRemoved() {
  const state = _state.get( this );
  if (state === MODEL_STATE.created || state === MODEL_STATE.markedForRemoval) {
    _state.set( this, MODEL_STATE.removed );
    _isDirty.set( this, false );
  }
  else if (state !== MODEL_STATE.removed)
    illegal.call( this, MODEL_STATE.removed );
}

function illegal( newState ) {
  const state = _state.get( this );
  throw new ModelError(
    'transition',
    (state == null ? 'NULL' : MODEL_STATE.getName( state )),
    MODEL_STATE.getName( newState )
  );
}

function propagateRemoval() {
  this.forEach( function ( child ) {
    child.remove();
  } );
}

//endregion

//region Transfer object methods

function getTransferContext() {
  return new ClientTransferContext( null, null, null );
}

function baseToCto() {
  const cto = [];
  this.forEach( function ( item ) {
    cto.push( item.toCto() );
  } );
  return cto;
}

function baseFromCto( data ) {
  // Nothing to do.
}

//endregion

//region Permissions

function getAuthorizationContext( action, targetName ) {
  return new AuthorizationContext( action, targetName || '', _brokenRules.get( this ) );
}

function canDo( action ) {
  const rules = _rules.get( this );
  return rules.hasPermission(
    getAuthorizationContext.call( this, action )
  );
}

function canExecute( methodName ) {
  const rules = _rules.get( this );
  return rules.hasPermission(
    getAuthorizationContext.call( this, AuthorizationAction.executeMethod, methodName )
  );
}

//endregion

//region Child methods

function fetchChildren( data ) {
  const self = this;
  const itemType = _itemType.get( this );
  const eventHandlers = _eventHandlers.get( this );

  return data instanceof Array && data.length ?
    Promise.all( data.map( dto => {
      return itemType.load( self, dto, eventHandlers )
    } ) )
      .then( list => {
        // Add loaded items to the collection.
        const items = _items.get( self );
        list.forEach( item => {
          items.push( item );
        } );
        _items.set( self, items );
        const itemType = _itemType.get( this );
        // Nothing to return.
        return null;
      } ) :
    Promise.resolve( null );
}

function saveChildren( connection ) {
  const items = _items.get( this );
  return Promise.all( items.map( item => {
    return item.save( connection );
  } ) );
}

function childrenAreValid() {
  const items = _items.get( this );
  return items.every( item => {
    return item.isValid();
  } );
}

function checkChildRules() {
  this.forEach( item => {
    item.checkRules();
  } );
}

//endregion

//endregion

//region Data portal methods

//region Helper

function getDataContext( connection ) {
  let dataContext = _dataContext.get( this );
  if (!dataContext) {
    dataContext = new DataPortalContext( _dao.get( this ) );
    _dataContext.set( this, dataContext );
  }
  return dataContext.setState( connection, false );
}

function raiseEvent( event, methodName, error ) {
  this.emit(
    DataPortalEvent.getName( event ),
    new DataPortalEventArgs( event, this.$modelName, null, methodName, error )
  );
}

function raiseSave( event, action, error ) {
  this.emit(
    DataPortalEvent.getName( event ),
    new DataPortalEventArgs( event, this.$modelName, action, null, error )
  );
}

function wrapError( action, error ) {
  return new DataPortalError( MODEL_DESC, this.$modelName, action, error );
}

//endregion

//region Create

function data_create() {
  const self = this;
  return new Promise( ( fulfill, reject ) => {

    // Launch start event.
    /**
     * The event arises before the business object collection will be initialized in the repository.
     * @event EditableRootCollection#preCreate
     * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
     * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
     */
    raiseEvent.call( self, DataPortalEvent.preCreate );
    // Execute creation - nothing to do.
    markAsCreated.call( self );
    // Launch finish event.
    /**
     * The event arises after the business object collection has been initialized in the repository.
     * @event EditableRootCollection#postCreate
     * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
     * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
     */
    raiseEvent.call( self, DataPortalEvent.postCreate );
    // Return the new editable root collection.
    fulfill( self );
  } );
}

//endregion

//region Fetch

function data_fetch( filter, method ) {
  const self = this;
  return new Promise( ( fulfill, reject ) => {
    // Check permissions.
    if (method === M_FETCH ?
        canDo.call( self, AuthorizationAction.fetchObject ) :
        canExecute.call( self, method )) {

      let connection = null;
      const extensions = _extensions.get( self );
      // Open connection.
      config.connectionManager.openConnection( extensions.dataSource )
        .then( dsc => {
          connection = dsc;
          // Launch start event.
          /**
           * The event arises before the collection instance will be retrieved from the repository.
           * @event EditableRootCollection#preFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} oldObject - The collection instance before the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.preFetch, method );
          // Execute fetch.
          const dao = _dao.get( self );
          return extensions.dataFetch ?
            // *** Custom fetch.
            extensions.$runMethod( 'fetch', self, getDataContext.call( self, connection ), filter, method ) :
            // *** Standard fetch.
            // Root element fetches all data from repository.
            dao.$runMethod( method, connection, filter );
        } )
        .then( dto => {
          // Load children.
          return fetchChildren.call( self, dto );
        } )
        .then( none => {
          markAsPristine.call( self );
          // Launch finish event.
          /**
           * The event arises after the collection instance has been retrieved from the repository.
           * @event EditableRootCollection#postFetch
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} newObject - The collection instance after the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.postFetch, method );
          // Close connection.
          config.connectionManager.closeConnection( extensions.dataSource, connection )
            .then( none => {
              // Return the fetched editable root collection.
              fulfill( self );
            } );
        } )
        .catch( reason => {
          // Wrap the intercepted error.
          const dpe = wrapError.call( self, DataPortalAction.fetch, reason );
          // Launch finish event.
          raiseEvent.call( self, DataPortalEvent.postFetch, method, dpe );
          // Close connection.
          config.connectionManager.closeConnection( extensions.dataSource, connection )
            .then( none => {
              // Paa the error.
              reject( dpe );
            } );
        } );
    }
  } );
}

//endregion

//region Insert

function data_insert() {
  const self = this;
  return new Promise( ( fulfill, reject ) => {
    // Check permissions.
    if (canDo.call( self, AuthorizationAction.createObject )) {

      let connection = null;
      const extensions = _extensions.get( self );
      // Start transaction.
      config.connectionManager.beginTransaction( extensions.dataSource )
        .then( dsc => {
          connection = dsc;
          // Launch start event.
          raiseSave.call( self, DataPortalEvent.preSave, DataPortalAction.insert );
          /**
           * The event arises before the business object collection will be created in the repository.
           * @event EditableRootCollection#preInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.preInsert );
          // Execute insert - nothing to do.
          // Insert children as well.
          return saveChildren.call( self, connection );
        } )
        .then( none => {
          markAsPristine.call( self );
          // Launch finish event.
          /**
           * The event arises after the business object collection has been created in the repository.
           * @event EditableRootCollection#postInsert
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.postInsert );
          raiseSave.call( self, DataPortalEvent.postSave, DataPortalAction.insert );
          // Finish transaction.
          return config.connectionManager.commitTransaction( extensions.dataSource, connection )
            .then( none => {
              // Return the created editable root collection.
              fulfill( self );
            } );
        } )
        .catch( reason => {
          // Wrap the intercepted error.
          const dpe = wrapError.call( self, DataPortalAction.insert, reason );
          // Launch finish event.
          if (connection) {
            raiseEvent.call( self, DataPortalEvent.postInsert, null, dpe );
            raiseSave.call( self, DataPortalEvent.postSave, DataPortalAction.insert, dpe );
          }
          // Undo transaction.
          config.connectionManager.rollbackTransaction( extensions.dataSource, connection )
            .then( none => {
              // Pass the error.
              reject( dpe );
            } );
        } );
    }
  } );
}

//endregion

//region Update

function data_update() {
  const self = this;
  return new Promise( ( fulfill, reject ) => {
    // Check permissions.
    if (canDo.call( self, AuthorizationAction.updateObject )) {

      let connection = null;
      const extensions = _extensions.get( self );
      // Start transaction.
      config.connectionManager.beginTransaction( extensions.dataSource )
        .then( dsc => {
          connection = dsc;
          // Launch start event.
          raiseSave.call( self, DataPortalEvent.preSave, DataPortalAction.update );
          /**
           * The event arises before the business object collection will be updated in the repository.
           * @event EditableRootCollection#preUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.preUpdate );
          // Execute update - nothing to do.
          // Update children as well.
          return saveChildren.call( self, connection );
        } )
        .then( none => {
          markAsPristine.call( self );
          // Launch finish event.
          /**
           * The event arises after the business object collection has been updated in the repository.
           * @event EditableRootCollection#postUpdate
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.postUpdate );
          raiseSave.call( self, DataPortalEvent.postSave, DataPortalAction.update );
          // Finish transaction.
          config.connectionManager.commitTransaction( extensions.dataSource, connection )
            .then( none => {
              // Return the updated editable root collection.
              fulfill( self );
            } );
        } )
        .catch( reason => {
          // Wrap the intercepted error.
          const dpe = wrapError.call( self, DataPortalAction.update, reason );
          // Launch finish event.
          if (connection) {
            raiseEvent.call( self, DataPortalEvent.postUpdate, null, dpe );
            raiseSave.call( self, DataPortalEvent.postSave, DataPortalAction.update, dpe );
          }
          // Undo transaction.
          config.connectionManager.rollbackTransaction( extensions.dataSource, connection )
            .then( none => {
              // Pass the error.
              reject( dpe );
            } );
        } );
    }
  } );
}

//endregion

//region Remove

function data_remove() {
  const self = this;
  return new Promise( ( fulfill, reject ) => {
    // Check permissions.
    if (canDo.call( self, AuthorizationAction.removeObject )) {

      let connection = null;
      const extensions = _extensions.get( self );
      // Start transaction.
      config.connectionManager.beginTransaction( extensions.dataSource )
        .then( dsc => {
          connection = dsc;
          // Launch start event.
          raiseSave.call( self, DataPortalEvent.preSave, DataPortalAction.remove );
          /**
           * The event arises before the business object collection will be removed from the repository.
           * @event EditableRootCollection#preRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.preRemove );
          // Remove children first.
          return saveChildren.call( self, connection );
        } )
        .then( none => {
          // Execute removal - nothing to do.
          markAsRemoved.call( self );
          // Launch finish event.
          /**
           * The event arises after the business object collection has been removed from the repository.
           * @event EditableRootCollection#postRemove
           * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
           * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
           */
          raiseEvent.call( self, DataPortalEvent.postRemove );
          raiseSave.call( self, DataPortalEvent.postSave, DataPortalAction.remove );
          // Finish transaction.
          config.connectionManager.commitTransaction( extensions.dataSource, connection )
            .then( none => {
              // Nothing to return;
              fulfill( null );
            } );
        } )
        .catch( reason => {
          // Wrap the intercepted error.
          const dpe = wrapError.call( self, DataPortalAction.remove, reason );
          // Launch finish event.
          if (connection) {
            raiseEvent.call( self, DataPortalEvent.postRemove, null, dpe );
            raiseSave.call( self, DataPortalEvent.postSave, DataPortalAction.remove, dpe );
          }
          // Undo transaction.
          config.connectionManager.rollbackTransaction( extensions.dataSource, connection )
            .then( none => {
              // Pass the error.
              reject( dpe );
            } );
        } );
    }
  } );
}

//endregion

//endregion

/**
 * Represents the definition of an asynchronous editable root collection.
 *
 * @name EditableRootCollection
 * @extends CollectionBase
 *
 * @fires EditableRootCollection#preCreate
 * @fires EditableRootCollection#postCreate
 * @fires EditableRootCollection#preFetch
 * @fires EditableRootCollection#postFetch
 * @fires EditableRootCollection#preInsert
 * @fires EditableRootCollection#postInsert
 * @fires EditableRootCollection#preUpdate
 * @fires EditableRootCollection#postUpdate
 * @fires EditableRootCollection#preRemove
 * @fires EditableRootCollection#postRemove
 * @fires EditableRootCollection#preSave
 * @fires EditableRootCollection#postSave
 */
class EditableRootCollection extends CollectionBase {

  //region Constructor

  /**
   * Creates a new asynchronous editable root collection instance.
   *
   * _The name of the model type available as:
   * __&lt;instance&gt;.constructor.modelType__, returns 'EditableRootCollection'._
   *
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *    The event handlers must be an EventHandlerList object or null.
   */
  constructor( name, itemType, rules, extensions, eventHandlers ) {
    super();

    eventHandlers = Argument.inConstructor( name )
      .check( eventHandlers ).forOptional( 'eventHandlers' ).asType( EventHandlerList );

    _itemType.set( this, itemType );
    _rules.set( this, rules );
    _extensions.set( this, extensions );
    _eventHandlers.set( this, eventHandlers );
    _state.set( this, null );
    _isDirty.set( this, false );
    _isValidated.set( this, false );
    _brokenRules.set( this, new BrokenRuleList( name ) );
    _dataContext.set( this, null );
    _items.set( this, [] );

    // Get data access object.
    _dao.set( this, extensions.getDataAccessObject( name ) );

    /**
     * The name of the model.
     *
     * @member {string} EditableRootCollection#$modelName
     * @readonly
     */
    this.$modelName = name;

    // Set up business rules.
    rules.initialize( config.noAccessBehavior );

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup( this );

    // Immutable definition object.
    Object.freeze( this );
  }

  //endregion

  //region Properties

  /**
   * The count of the child objects in the collection.
   *
   * @member {number} EditableRootCollection#count
   * @readonly
   */
  get count() {
    const items = _items.get( this );
    return items.length;
  }

  /**
   * The name of the model type.
   *
   * @member {string} EditableRootCollection.modelType
   * @default ReadOnlyRootCollection
   * @readonly
   */
  static get modelType() {
    return ModelType.EditableRootCollection;
  }

  //endregion

  //region Mark object state

  /**
   * Notes that a child object has changed.
   * <br/>_This method is called by child objects._
   *
   * @function EditableRootCollection#childHasChanged
   * @protected
   */
  childHasChanged() {
    markAsChanged.call( this, false );
  }

  //endregion

  //region Show object state

  /**
   * Gets the state of the collection. Valid states are:
   * pristine, created, changed, markedForRemoval and removed.
   *
   * @function EditableRootCollection#getModelState
   * @returns {string} The state of the collection.
   */
  getModelState() {
    return MODEL_STATE.getName( _state.get( this ) );
  }

  /**
   * Indicates whether the business object collection has been created newly
   * and not has been yet saved, i.e. its state is created.
   *
   * @function EditableRootCollection#isNew
   * @returns {boolean} True when the business object collection is new, otherwise false.
   */
  isNew() {
    return _state.get( this ) === MODEL_STATE.created;
  }

  /**
   * Indicates whether the business object collection itself or any of its child objects differs the
   * one that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
   *
   * @function EditableRootCollection#isDirty
   * @returns {boolean} True when the business object collection has been changed, otherwise false.
   */
  isDirty() {
    const state = _state.get( this );
    return state === MODEL_STATE.created ||
      state === MODEL_STATE.changed ||
      state === MODEL_STATE.markedForRemoval;
  }

  /**
   * Indicates whether the business object collection itself, ignoring its child objects,
   * differs the one that is stored in the repository.
   *
   * @function EditableRootCollection#isSelfDirty
   * @returns {boolean} True when the business object collection itself has been changed, otherwise false.
   */
  isSelfDirty() {
    return _isDirty.get( this );
  }

  /**
   * Indicates whether the business object collection will be deleted from the repository,
   * i.e. its state is markedForRemoval.
   *
   * @function EditableRootCollection#isDeleted
   * @returns {boolean} True when the business object collection will be deleted, otherwise false.
   */
  isDeleted() {
    return _state.get( this ) === MODEL_STATE.markedForRemoval;
  }

  /**
   * Indicates whether the business object collection can be saved to the repository,
   * i.e. it has ben changed and is valid, and the user has permission to save it.
   *
   * @function EditableRootCollection#isSavable
   * @returns {boolean} True when the user can save the business object collection, otherwise false.
   */
  isSavable() {
    let auth;
    if (this.isDeleted)
      auth = canDo.call( this, AuthorizationAction.removeObject );
    else if (this.isNew)
      auth = canDo.call( this, AuthorizationAction.createObject );
    else
      auth = canDo.call( this, AuthorizationAction.updateObject );
    return auth && this.isDirty && this.isValid();
  }

  //endregion

  //region Transfer object methods

  /**
   * Transforms the business object collection to a plain object array to send to the client.
   *
   * @function EditableRootCollection#toCto
   * @returns {object} The client transfer object.
   */
  toCto() {
    const extensions = _extensions.get( this );
    if (extensions.toCto)
      return extensions.toCto.call( this, getTransferContext() );
    else
      return baseToCto.call( this );
  }

  /**
   * Rebuilds the business object collection from a plain object array sent by the client.
   *
   * @function EditableRootCollection#fromCto
   * @param {object[]} cto - The client transfer object.
   * @returns {Promise.<EditableRootCollection>} Returns a promise to the editable root collection rebuilt.
   */
  fromCto( cto ) {
    const self = this;
    return new Promise( ( fulfill, reject ) => {
      const extensions = _extensions.get( self );
      if (extensions.fromCto)
        extensions.fromCto.call( self, getTransferContext(), cto );
      else
        baseFromCto.call( self, cto );

      if (cto instanceof Array) {
        const items = _items.get( self );
        const ctoNew = cto.filter( d => { return true; } ); // Deep copy.
        const itemsLive = [];
        const itemsLate = [];
        let index;

        // Discover changed items.
        for (index = 0; index < items.length; index++) {
          let dataFound = false;
          let i = 0;
          for (; i < ctoNew.length; i++) {
            if (items[ index ].keyEquals( cto[ i ] )) {
              itemsLive.push( { item: index, cto: i } );
              dataFound = true;
              break;
            }
          }
          dataFound ?
            ctoNew.splice( i, 1 ) :
            itemsLate.push( index );
        }
        // Update existing items.
        Promise.all( itemsLive.map( live => {
          return items[ live.item ].fromCto( cto[ live.cto ] );
        } ) )
          .then( values => {
            // Remove non existing items.
            for (index = 0; index < itemsLate.length; index++) {
              items[ itemsLate[ index ] ].remove();
            }
            // Insert non existing items.
            const itemType = _itemType.get( self );
            const eventHandlers = _eventHandlers.get( self );

            Promise.all( ctoNew.map( cto => {
              return itemType.create( self, eventHandlers )
            } ) )
              .then( newItems => {
                items.push.apply( items, newItems );
                Promise.all( newItems.map( ( newItem, i ) => {
                  return newItem.fromCto( ctoNew[ i ] );
                } ) )
                  .then( values => {
                    _items.set( self, items );
                    // Finished.
                    fulfill( self );
                  } )
              } );
          } );
      } else
      // Nothing to do.
        fulfill( self );
    } );
  }

  //endregion

  //region Actions

  /**
   * Initializes a newly created business object collection.
   * <br/>_This method is called by a factory method with the same name._
   *
   * @function EditableRootCollection#create
   * @protected
   * @returns {Promise.<EditableRootCollection>} Returns a promise to the new editable root collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object collection has failed.
   */
  create() {
    return data_create.call( this );
  }

  /**
   * Creates a new item and adds it to the collection at the specified index.
   *
   * @function EditableRootCollection#create
   * @param {number} [index] - The index of the new item.
   * @returns {Promise.<EditableChildObject>} Returns a promise to the editable child object created.
   */
  createItem( index ) {
    const self = this;
    const itemType = _itemType.get( this );
    const eventHandlers = _eventHandlers.get( this );

    return itemType.create( this, eventHandlers )
      .then( item => {
        const items = _items.get( self );
        let ix = parseInt( index, 10 );
        ix = isNaN( ix ) ? items.length : ix;
        items.splice( ix, 0, item );
        _items.set( self, items );
        return item;
      } );
  }

  /**
   * Initializes a business object collection to be retrieved from the repository.
   * <br/>_This method is called by a factory method with the same name._
   *
   * @function EditableRootCollection#fetch
   * @protected
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @returns {Promise.<EditableRootCollection>} Returns a promise to the retrieved editable root collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The method must be a string or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Fetching the business object collection has failed.
   */
  fetch( filter, method ) {
    method = Argument.inMethod( this.$modelName, 'fetch' )
      .check( method ).forOptional( 'method' ).asString();
    return data_fetch.call( this, filter, method || M_FETCH );
  }

  /**
   * Saves the changes of the business object collection to the repository.
   *
   * @function EditableRootCollection#save
   * @return {Promise.<EditableRootCollection>} Returns a promise to the saved editable root collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The callback must be a function.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Inserting the business object collection has failed.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Updating the business object collection has failed.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Deleting the business object collection has failed.
   */
  save() {
    const self = this;

    function expelRemovedItems() {
      let items = _items.get( self );
      items = items.filter( item => {
        return item.getModelState() !== MODEL_STATE.getName( MODEL_STATE.removed );
      } );
      _items.set( self, items );
    }

    return new Promise( ( fulfill, reject ) => {
      if (self.isValid()) {
        /**
         * The event arises before the business object collection will be saved in the repository.
         * The event is followed by a preInsert, preUpdate or preRemove event depending on the
         * state of the business object collection.
         * @event EditableRootCollection#preSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} oldObject - The instance of the collection before the data portal action.
         */
        let state = _state.get( self );
        switch (state) {
          case MODEL_STATE.created:
            data_insert.call( self )
              .then( inserted => {
                fulfill( inserted );
              } );
            break;
          case MODEL_STATE.changed:
            data_update.call( self )
              .then( updated => {
                expelRemovedItems();
                fulfill( updated );
              } );
            break;
          case MODEL_STATE.markedForRemoval:
            data_remove.call( self )
              .then( removed => {
                expelRemovedItems();
                fulfill( removed );
              } );
            break;
          default:
            fulfill( self );
        }
        /**
         * The event arises after the business object collection has been saved in the repository.
         * The event is preceded by a postInsert, postUpdate or postRemove event depending on the
         * state of the business object collection.
         * @event EditableRootCollection#postSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollection} newObject - The instance of the collection after the data portal action.
         */
      }
    } );
  }

  /**
   * Marks the business object collection to be deleted from the repository on next save.
   *
   * @function EditableRootCollection#remove
   */
  remove() {
    markForRemoval.call( this );
  }

  //endregion

  //region Validation

  /**
   * Indicates whether all validation rules of all business objects of the
   * collection succeeds. A valid business object collection may have
   * broken rules with severity of success, information and warning.
   *
   * @function EditableRootCollection#isValid
   * @returns {boolean} True when the business object collection is valid, otherwise false.
   */
  isValid() {
    if (!_isValidated.get( this ))
      this.checkRules();

    const brokenRules = _brokenRules.get( this );
    return brokenRules.isValid() && childrenAreValid.call( this );
  }

  /**
   * Executes all the validation rules of the business object, including the ones
   * of its child objects.
   *
   * @function EditableRootCollection#checkRules
   */
  checkRules() {
    const brokenRules = _brokenRules.get( this );
    brokenRules.clear();
    _brokenRules.set( this, brokenRules );

    checkChildRules.call( this );

    _isValidated.set( this, true );
  }

  /**
   * Gets the broken rules of the business object.
   *
   * @function EditableRootCollection#getBrokenRules
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
   */
  getBrokenRules( namespace ) {
    const brokenRules = _brokenRules.get( this );
    const bro = brokenRules.output( namespace );

    this.forEach( item => {
      const childBrokenRules = item.getBrokenRules( namespace );
      if (childBrokenRules)
        bro.addChild( this.$modelName, childBrokenRules );
    } );

    return bro.$length ? bro : null;
  };

  /**
   * Gets the response to send to the client in case of broken rules.
   *
   * @function EditableRootCollection#getResponse
   * @param {string} [message] - Human-readable description of the reason of the failure.
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRulesResponse} The broken rules response to send to the client.
   */
  getResponse( message, namespace ) {
    const output = this.getBrokenRules( namespace );
    return output ? new BrokenRulesResponse( output, message ) : null;
  };

  //endregion

  //region Public array methods

  /**
   * Gets a collection item at a specific position.
   *
   * @function EditableRootCollection#at
   * @param {number} index - The index of the required item in the collection.
   * @returns {EditableChildObject} The required collection item.
   */
  at( index ) {
    const items = _items.get( this );
    return items[ index ];
  }

  /**
   * Executes a provided function once per collection item.
   *
   * @function EditableRootCollection#forEach
   * @param {external.cbCollectionItem} callback - Function that produces an item of the new collection.
   */
  forEach( callback ) {
    const items = _items.get( this );
    items.forEach( callback );
  }

  /**
   * Tests whether all items in the collection pass the test implemented by the provided function.
   *
   * @function EditableRootCollection#every
   * @param {external.cbCollectionItem} callback - Function to test for each collection item.
   * @returns {boolean} True when callback returns truthy value for each item, otherwise false.
   */
  every( callback ) {
    const items = _items.get( this );
    return items.every( callback );
  }

  /**
   * Tests whether some item in the collection pass the test implemented by the provided function.
   *
   * @function EditableRootCollection#some
   * @param {external.cbCollectionItem} callback - Function to test for each collection item.
   * @returns {boolean} True when callback returns truthy value for some item, otherwise false.
   */
  some( callback ) {
    const items = _items.get( this );
    return items.some( callback );
  }

  /**
   * Creates a new array with all collection items that pass the test
   * implemented by the provided function.
   *
   * @function EditableRootCollection#filter
   * @param {external.cbCollectionItem} callback - Function to test for each collection item.
   * @returns {Array.<EditableChildObject>} The new array of collection items.
   */
  filter( callback ) {
    const items = _items.get( this );
    return items.filter( callback );
  }

  /**
   * Creates a new array with the results of calling a provided function
   * on every item in this collection.
   *
   * @function EditableRootCollection#map
   * @param {external.cbCollectionItem} callback - Function to test for each collection item.
   * @returns {Array.<*>} The new array of callback results.
   */
  map( callback ) {
    const items = _items.get( this );
    return items.map( callback );
  }

  /**
   * Sorts the items of the collection in place and returns the collection.
   *
   * @function EditableRootCollection#sort
   * @param {external.cbCompare} [fnCompare] - Function that defines the sort order.
   *      If omitted, the collection is sorted according to each character's Unicode
   *      code point value, according to the string conversion of each item.
   * @returns {Array.<EditableChildObject>} The sorted collection.
   */
  sort( fnCompare ) {
    const items = _items.get( this );
    const sorted = items.sort( fnCompare );
    _items.set( this, sorted );
    return sorted;
  }

  //endregion
}

/**
 * Factory method to create definitions of editable root collections.
 *
 * @name bo.EditableRootCollection
 */
class EditableRootCollectionFactory {

  //region Constructor

  /**
   * Creates a definition for an editable root collection.
   *
   *    Valid collection item types are:
   *
   *      * EditableChildObject
   *
   * @param {string} name - The name of the collection.
   * @param {EditableChildObject} itemType - The model type of the collection items.
   * @param {bo.shared.RuleManager} rules - The authorization rules.
   * @param {bo.shared.ExtensionManager} extensions - The customization of the collection.
   * @returns {EditableRootCollection} The constructor of an asynchronous editable root collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The collection name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The rules must be a RuleManager object.
   * @throws {@link bo.system.ArgumentError Argument error}: The extensions must be a ExtensionManager object.
   * @throws {@link bo.shared.ModelError Model error}: The item type must be an EditableChildObject.
   */
  constructor( name, itemType, rules, extensions ) {
    const check = Argument.inConstructor( ModelType.EditableRootCollection );

    name = check( name ).forMandatory( 'name' ).asString();
    rules = check( rules ).forMandatory( 'rules' ).asType( RuleManager );
    extensions = check( extensions ).forMandatory( 'extensions' ).asType( ExtensionManager );

    // Verify the model type of the item type.
    if (itemType.modelType !== ModelType.EditableChildObject)
      throw new ModelError( 'invalidItem',
        itemType.prototype.name, itemType.modelType,
        ModelType.EditableRootCollection, ModelType.EditableChildObject );

    // Create model definition.
    const Model = EditableRootCollection.bind( undefined, name, itemType, rules, extensions );

    //region Factory methods

    /**
     * The name of the model type.
     *
     * @member {string} EditableRootCollection.modelType
     * @default EditableRootCollection
     * @readonly
     */
    Model.modelType = ModelType.EditableRootCollection;

    /**
     * Creates a new editable business object collection.
     *
     * @function EditableRootCollection.create
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {Promise.<EditableRootCollection>} Returns a promise to the new editable root collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The event handlers must be an EventHandlerList object or null.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object collection has failed.
     */
    Model.create = function ( eventHandlers ) {
      const instance = new Model( eventHandlers );
      return instance.create();
    };

    /**
     * Retrieves an editable business object collection from the repository.
     *
     * @function EditableRootCollection.fetch
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
     * @returns {Promise.<EditableRootCollection>} Returns a promise to the retrieved editable root collection.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The event handlers must be an EventHandlerList object or null.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Fetching the business object collection has failed.
     */
    Model.fetch = function ( filter, method, eventHandlers ) {
      const instance = new Model( eventHandlers );
      return instance.fetch( filter, method );
    };

    //endregion

    // Immutable definition class.
    Object.freeze( Model );
    return Model;
  }

  //endregion
}
// Immutable factory class.
Object.freeze( EditableRootCollectionFactory );

module.exports = EditableRootCollectionFactory;
