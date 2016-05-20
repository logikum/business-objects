'use strict';

const Argument = require( '../system/argument-check.js' );
const DataPortalEvent = require( './data-portal-event.js' );
const ModalBase = require( '../model-base.js' );
const CollectionBase = require( '../collection-base.js' );

const _items = new WeakMap();

/**
 * Provides methods to manage the event handlers of a business object instance.
 *
 * @memberof bo.shared
 */
class EventHandlerList {

  /**
   * Creates a new event handler list object.
   */
  constructor() {
    _items.set( this, new Set() );
  }

  /**
   * Adds a new event handler to to list.
   *
   * @param {string} modelName - The name of the business object model.
   * @param {bo.shared.DataPortalEvent} event - The event to listen.
   * @param {external.eventHandler} handler - A function to be invoked when the event is emitted.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The event must be a DataPortalEvent member.
   * @throws {@link bo.system.ArgumentError Argument error}: The handler must be a function.
   */
  add( modelName, event, handler ) {
    const check = Argument.inMethod( this.constructor.name, 'add' );
    const items = _items.get( this );
    items.add( {
      modelName: check( modelName ).forMandatory( 'modelName' ).asString(),
      event: check( event ).for( 'event' ).asEnumMember( DataPortalEvent, null ),
      handler: check( handler ).forMandatory( 'handler' ).asFunction()
    } );
    _items.set( this, items );
  }

  /**
   * Adds the event handlers with the model name of the target object
   * to the target object for all events. This method is called by models
   * internally to set up the event handlers.
   *
   * @protected
   * @param {bo.ModalBase|bo.CollectionBase} target - A business object instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   */
  setup( target ) {
    target = Argument.inMethod( this.constructor.name, 'setup' )
      .check( target ).forMandatory( 'target' ).asType( [ ModalBase, CollectionBase ] );

    const items = _items.get( this );
    for (const item of items) {
      if (item.modelName === target.$modelName)
        target.on( DataPortalEvent.getName( item.event ), item.handler )
    }
  }
}

module.exports = EventHandlerList;
