console.log( 'Testing common/index.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const common = read( 'common/index.js' );
const Text = read( 'data-types/text.js' );

const ExtensionManager = read( 'common/extension-manager.js' );
const EventHandlerList = read( 'common/event-handler-list.js' );
const DataStore = read( 'common/data-store.js' );
//const ModelState = read( 'common/model-state.js');
const ModelError = read( 'common/model-error.js' );

const PropertyInfo = read( 'common/property-info.js' );
const PropertyFlag = read( 'common/property-flag.js' );
const PropertyManager = read( 'common/property-manager.js' );
const PropertyContext = read( 'common/property-context.js' );
const ClientTransferContext = read( 'common/client-transfer-context.js' );
const DataTransferContext = read( 'common/data-transfer-context.js' );

const DataPortalAction = read( 'common/data-portal-action.js' );
const DataPortalContext = read( 'common/data-portal-context.js' );
const DataPortalEvent = read( 'common/data-portal-event.js' );
const DataPortalEventArgs = read( 'common/data-portal-event-args.js' );
const DataPortalError = read( 'common/data-portal-error.js' );

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

    expect( new common.ExtensionManager( 'data_source', '/model/path' ) ).toEqual( jasmine.any( ExtensionManager ) );
    expect( new common.EventHandlerList() ).toEqual( jasmine.any( EventHandlerList ) );
    expect( new common.DataStore() ).toEqual( jasmine.any( DataStore ) );
    expect( common.ModelState ).toEqual( jasmine.any( Enumeration ) );
    expect( new common.ModelError( 'message' ) ).toEqual( jasmine.any( ModelError ) );

    expect( new common.PropertyInfo( 'property', text ) ).toEqual( jasmine.any( PropertyInfo ) );
    expect( common.PropertyFlag ).toBe( PropertyFlag );
    expect( new common.PropertyManager() ).toEqual( jasmine.any( PropertyManager ) );
    expect( new common.PropertyContext( 'model', [], getValue, setValue ) ).toEqual( jasmine.any( PropertyContext ) );
    expect( new common.ClientTransferContext( [], getValue, setValue ) ).toEqual( jasmine.any( ClientTransferContext ) );
    expect( new common.DataTransferContext( [], getValue, setValue ) ).toEqual( jasmine.any( DataTransferContext ) );

    expect( common.DataPortalAction ).toBe( DataPortalAction );
    expect( new common.DataPortalContext( dao, [], getValue, setValue ) ).toEqual( jasmine.any( DataPortalContext ) );
    expect( common.DataPortalEvent ).toBe( DataPortalEvent );
    expect( new common.DataPortalEventArgs( DataPortalEvent.preCreate, 'model' ) ).toEqual( jasmine.any( DataPortalEventArgs ) );
    expect( new common.DataPortalError( 'type', 'name', 0, {} ) ).toEqual( jasmine.any( DataPortalError ) );
  } );
} );
