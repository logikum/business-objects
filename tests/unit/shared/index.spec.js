console.log( 'Testing shared/index.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const shared = read( 'shared/index.js' );
const Text = read( 'data-types/text.js' );

const ExtensionManager = read( 'shared/extension-manager.js' );
const EventHandlerList = read( 'shared/event-handler-list.js' );
const DataStore = read( 'shared/data-store.js' );
//const ModelState = read( 'shared/model-state.js');
const ModelError = read( 'shared/model-error.js' );

const PropertyInfo = read( 'shared/property-info.js' );
const PropertyFlag = read( 'shared/property-flag.js' );
const PropertyManager = read( 'shared/property-manager.js' );
const PropertyContext = read( 'shared/property-context.js' );
const ClientTransferContext = read( 'shared/client-transfer-context.js' );
const DataTransferContext = read( 'shared/data-transfer-context.js' );

const DataPortalAction = read( 'shared/data-portal-action.js' );
const DataPortalContext = read( 'shared/data-portal-context.js' );
const DataPortalEvent = read( 'shared/data-portal-event.js' );
const DataPortalEventArgs = read( 'shared/data-portal-event-args.js' );
const DataPortalError = read( 'shared/data-portal-error.js' );

const Enumeration = read( 'system/enumeration.js' );

describe( 'Shared component index', () => {

  const text = new Text();
  const dao = {};
  let data = 0;

  function getValue() {
    return data;
  }

  function setValue( value ) {
    data = value;
  }

  it( 'properties return correct components', () => {

    expect( new shared.ExtensionManager( 'data_source', '/model/path' ) ).toEqual( jasmine.any( ExtensionManager ) );
    expect( new shared.EventHandlerList() ).toEqual( jasmine.any( EventHandlerList ) );
    expect( new shared.DataStore() ).toEqual( jasmine.any( DataStore ) );
    expect( shared.ModelState ).toEqual( jasmine.any( Enumeration ) );
    expect( new shared.ModelError( 'message' ) ).toEqual( jasmine.any( ModelError ) );

    expect( new shared.PropertyInfo( 'property', text ) ).toEqual( jasmine.any( PropertyInfo ) );
    expect( shared.PropertyFlag ).toBe( PropertyFlag );
    expect( new shared.PropertyManager() ).toEqual( jasmine.any( PropertyManager ) );
    expect( new shared.PropertyContext( 'model', [], getValue, setValue ) ).toEqual( jasmine.any( PropertyContext ) );
    expect( new shared.ClientTransferContext( [], getValue, setValue ) ).toEqual( jasmine.any( ClientTransferContext ) );
    expect( new shared.DataTransferContext( [], getValue, setValue ) ).toEqual( jasmine.any( DataTransferContext ) );

    expect( shared.DataPortalAction ).toBe( DataPortalAction );
    expect( new shared.DataPortalContext( dao, [], getValue, setValue ) ).toEqual( jasmine.any( DataPortalContext ) );
    expect( shared.DataPortalEvent ).toBe( DataPortalEvent );
    expect( new shared.DataPortalEventArgs( DataPortalEvent.preCreate, 'model' ) ).toEqual( jasmine.any( DataPortalEventArgs ) );
    expect( new shared.DataPortalError( 'type', 'name', 0, {} ) ).toEqual( jasmine.any( DataPortalError ) );
  } );
} );
