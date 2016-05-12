console.log( 'Testing shared/data-portal-action.js...' );

const DataPortalAction = require( '../../../source/shared/data-portal-action.js' );

describe( 'Data portal action enumeration', function () {

  it( '$name property returns the type name', function () {

    expect( DataPortalAction.$name ).toBe( 'DataPortalAction' );
  } );

  it( 'has the defined items', function () {

    expect( DataPortalAction.create ).toBe( 0 );
    expect( DataPortalAction.fetch ).toBe( 1 );
    expect( DataPortalAction.insert ).toBe( 2 );
    expect( DataPortalAction.update ).toBe( 3 );
    expect( DataPortalAction.remove ).toBe( 4 );
    expect( DataPortalAction.execute ).toBe( 5 );
  } );

  it( 'count method returns the item count', function () {

    expect( DataPortalAction.count() ).toBe( 6 );
  } );

  it( 'getName method returns the item name', function () {

    expect( DataPortalAction.getName( 0 ) ).toBe( 'create' );
    expect( DataPortalAction.getName( 1 ) ).toBe( 'fetch' );
    expect( DataPortalAction.getName( 2 ) ).toBe( 'insert' );
    expect( DataPortalAction.getName( 3 ) ).toBe( 'update' );
    expect( DataPortalAction.getName( 4 ) ).toBe( 'remove' );
    expect( DataPortalAction.getName( 5 ) ).toBe( 'execute' );
  } );

  it( 'getValue method returns the item value', function () {

    expect( DataPortalAction.getValue( 'create' ) ).toBe( 0 );
    expect( DataPortalAction.getValue( 'fetch' ) ).toBe( 1 );
    expect( DataPortalAction.getValue( 'insert' ) ).toBe( 2 );
    expect( DataPortalAction.getValue( 'update' ) ).toBe( 3 );
    expect( DataPortalAction.getValue( 'remove' ) ).toBe( 4 );
    expect( DataPortalAction.getValue( 'execute' ) ).toBe( 5 );
  } );

  it( 'check method inspects a value', function () {

    function check1() {DataPortalAction.check( -1 ); }
    function check2() {DataPortalAction.check( DataPortalAction.create ); }
    function check3() {DataPortalAction.check( DataPortalAction.fetch ); }
    function check4() {DataPortalAction.check( DataPortalAction.insert ); }
    function check5() {DataPortalAction.check( DataPortalAction.update ); }
    function check6() {DataPortalAction.check( DataPortalAction.remove ); }
    function check7() {DataPortalAction.check( DataPortalAction.execute ); }
    function check8() {DataPortalAction.check( 6 ); }

    expect( check1 ).toThrow();
    expect( check2 ).not.toThrow();
    expect( check3 ).not.toThrow();
    expect( check4 ).not.toThrow();
    expect( check5 ).not.toThrow();
    expect( check6 ).not.toThrow();
    expect( check7 ).not.toThrow();
    expect( check8 ).toThrow();
  } );
} );
