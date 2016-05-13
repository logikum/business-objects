console.log( 'Testing shared/event-handler-list.js...' );

const EventHandlerList = require( '../../../source/shared/event-handler-list.js' );
const ModelBase = require( '../../../source/model-base.js' );
const DataPortalEventArgs = require( '../../../source/shared/data-portal-event-args.js' );
const DataPortalEvent = require( '../../../source/shared/data-portal-event.js' );

describe( 'Event handler list', () => {

  it( 'constructor expects no arguments', () => {
    const build01 = function () { return new EventHandlerList(); };

    expect( build01 ).not.toThrow();
  } );

  it( 'add and setup methods work', () => {

    class Model extends ModelBase {
      constructor( eventhandlers ) {
        super();
        this.$modelName = 'model';
        eventhandlers.setup( this );
        this.emit(
          'postCreate',
          new DataPortalEventArgs( DataPortalEvent.postCreate, this.$modelName ),
          this
        );
      }
    }
    let result = '';

    function ehCreated( eventArgs, model ) {
      result = 'Event ' + eventArgs.modelName + '.' + eventArgs.eventName + ': Model has been created.';
    }

    const ehl = new EventHandlerList();
    ehl.add( 'model', DataPortalEvent.postCreate, ehCreated );

    const model = new Model( ehl );

    expect( result ).toBe( 'Event model.postCreate: Model has been created.' );
  } );

} );
