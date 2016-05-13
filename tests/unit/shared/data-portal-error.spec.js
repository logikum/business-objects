console.log( 'Testing shared/data-portal-error.js...' );

const DataPortalError = require( '../../../source/shared/data-portal-error.js' );
const DataPortalAction = require( '../../../source/shared/data-portal-action.js' );

describe( 'Data portal error', () => {

  it( 'constructor expects three-four arguments', () => {

    function build01() { const err = new DataPortalError(); }
    function build02() { const err = new DataPortalError( 1, 2, 3 ); }
    function build03() { const err = new DataPortalError( 'type', 'model', true ); }
    function build04() { const err = new DataPortalError( 'type', {}, 'action' ); }
    function build05() { const err = new DataPortalError( [], 'model', 'action' ); }
    function build06() { const err = new DataPortalError( 'type', 'model', DataPortalAction.fetch ); }
    function build07() { const err = new DataPortalError( 'type', 'model', DataPortalAction.create, {} ); }
    function build08() { const err = new DataPortalError( 'type', 'model', DataPortalAction.remove, { error: 'description' } ); }

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'has six properties', () => {

    const ie = new Error( 'Intercepted error' );
    const dpe = new DataPortalError( 'Model type', 'ModelName', DataPortalAction.execute, ie );

    expect( dpe ).toEqual( jasmine.any( Error ) );
    expect( dpe.name ).toBe( 'DataPortalError' );
    expect( dpe.modelType ).toBe( 'Model type' );
    expect( dpe.modelName ).toBe( 'ModelName' );
    expect( dpe.action ).toBe( 'execute' );
    expect( dpe.message ).toBe( 'Executing ModelName has failed.' );
    expect( dpe.innerError ).toBe( ie );
  } );
} );
