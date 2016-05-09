console.log( 'Testing data-types/date-time.js...' );

var DateTime = require( '../../../source/data-types/date-time.js' );
var DataType = require( '../../../source/data-types/data-type.js' );

describe( 'DateTime type', function () {
  var dt = new DateTime();

  it( 'constructor returns a data type', function () {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has one read-only property', function () {
    dt.name = '---';

    expect( dt.name ).toBe( 'DateTime' );
  } );

  it( 'parse method expects DateTime', function () {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).not.toBeNull();
    expect( dt.parse( 0 ) ).not.toBeNull();
    expect( dt.parse( 3.1415926 ) ).not.toBeNull();
    expect( dt.parse( '' ) ).toBeUndefined();
    expect( dt.parse( 'Shakespeare' ) ).toBeUndefined();
    expect( dt.parse( new Date() ) ).toBeDefined();
    expect( dt.parse( {} ) ).toBeUndefined();
    expect( dt.parse( [] ) ).toBeUndefined();
    expect( dt.parse( fn ) ).toBeUndefined();
    expect( dt.parse( '1995-12-17T03:24:00' ) ).toEqual( new Date( 1995, 11, 17, 4, 24, 0 ) );
    expect( dt.parse( 'December 17, 1995 03:24:00' ) ).toEqual( new Date( 1995, 11, 17, 3, 24, 0 ) );
  } );

  it( 'hasValue method works', function () {

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( new Date() ) ).toBe( true );
  } );
} );
