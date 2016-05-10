console.log( 'Testing data-types/decimal.js...' );

const Decimal = require( '../../../source/data-types/decimal.js' );
const DataType = require( '../../../source/data-types/data-type.js' );

describe( 'Decimal type', function () {
  const dt = new Decimal();

  it( 'constructor returns a data type', function () {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has one read-only property', function () {
    dt.name = '---';

    expect( dt.name ).toBe( 'Decimal' );
  } );

  it( 'parse method expects decimal', function () {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).toBe( 1 );
    expect( dt.parse( 0 ) ).toBe( 0 );
    expect( dt.parse( 3.1415926 ) ).toBe( 3.1415926 );
    expect( dt.parse( '' ) ).toBe( 0 );
    expect( dt.parse( 'Shakespeare' ) ).toBeUndefined();
    expect( dt.parse( new Date() ) ).toBeGreaterThan( 1000000 );
    expect( dt.parse( {} ) ).toBeUndefined();
    expect( dt.parse( [] ) ).toBe( 0 );
    expect( dt.parse( fn ) ).toBeUndefined();
    expect( dt.parse( '123' ) ).toBe( 123 );
    expect( dt.parse( '0x11' ) ).toBe( 17 );
    expect( dt.parse( '0.987' ) ).toBe( 0.987 );
  } );

  it( 'hasValue method works', function () {
    function hasValue1() { return dt.hasValue(); }

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( 0 ) ).toBe( true );
    expect( dt.hasValue( 1024 ) ).toBe( true );
    expect( dt.hasValue( 3.1415926 ) ).toBe( true );
    expect( dt.hasValue( -45672.78 ) ).toBe( true );
  } );
} );
