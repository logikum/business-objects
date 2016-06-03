'use strict';

const Argument = require( '../system/argument-check.js' );
const DataPortalEvent = require( './data-portal-event.js' );
const ModelBase = require( '../model-base.js' );
const CollectionBase = require( '../collection-base.js' );

/**
 * Provides methods to manage the event handlers of a business object instance.
 *
 * @memberof bo.shared
 * @extends Set
 */
class EventHandlerList extends Set {

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
    const check = Argument.inMethod( EventHandlerList.name, 'add' );
    super.add( {
      modelName: check( modelName ).forMandatory( 'modelName' ).asString(),
      event: check( event ).for( 'event' ).asEnumMember( DataPortalEvent, null ),
      handler: check( handler ).forMandatory( 'handler' ).asFunction()
    } );
  }

  /**
   * Adds the event handlers with the model name of the target object
   * to the target object for all events. This method is called by models
   * internally to set up the event handlers.
   *
   * @protected
   * @param {ModalBase|CollectionBase} target - A business object instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   */
  setup( target ) {
    target = Argument.inMethod( EventHandlerList.name, 'setup' )
      .check( target ).forMandatory( 'target' ).asType( [ ModelBase, CollectionBase ] );

    for (const item of this) {
      if (item.modelName === target.$modelName)
        target.on( DataPortalEvent.getName( item.event ), item.handler )
    }
  }
}

module.exports = EventHandlerList;
