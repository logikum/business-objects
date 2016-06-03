console.log( 'Testing shared/event-handler-list.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const EventHandlerList = read( 'shared/event-handler-list.js' );
const ModelBase = read( 'common/model-base.js' );
const DataPortalEventArgs = read( 'shared/data-portal-event-args.js' );
const DataPortalEvent = read( 'shared/data-portal-event.js' );

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

  it( 'add and setup methods work (2)', () => {

    const ehl = new EventHandlerList();
    function test01() { ehl.add( 1, DataPortalEvent.postCreate ); }
    function test02() { ehl.setup( 'target' ); }

    expect( test01 ).toThrow( 'The modelName argument of EventHandlerList.add method must be a non-empty string.' );
    expect( test02 ).toThrow( 'The target argument of EventHandlerList.setup method must be a ModelBase | CollectionBase object.' );
  } );
} );
