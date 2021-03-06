console.log( 'Testing data-types/integer.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const Integer = read( 'data-types/integer.js' );
const DataType = read( 'data-types/data-type.js' );

describe( 'Integer type', () => {
  const dt = new Integer();

  it( 'constructor returns a data type', () => {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has one read-only property', () => {
    dt.name = '---';

    expect( dt.name ).toBe( 'Integer' );
  } );

  it( 'parse method expects integer', () => {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).toBe( 1 );
    expect( dt.parse( 0 ) ).toBe( 0 );
    expect( dt.parse( 3.1415926 ) ).toBeUndefined();
    expect( dt.parse( '' ) ).toBe( 0 );
    expect( dt.parse( 'Shakespeare' ) ).toBeUndefined();
    expect( dt.parse( new Date() ) ).toBeGreaterThan( 1000000 );
    expect( dt.parse( {} ) ).toBeUndefined();
    expect( dt.parse( [] ) ).toBe( 0 );
    expect( dt.parse( fn ) ).toBeUndefined();
    expect( dt.parse( '1456' ) ).toBe( 1456 );
    expect( dt.parse( '0x101' ) ).toBe( 257 );
  } );

  it( 'hasValue method works', () => {

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( 0 ) ).toBe( true );
    expect( dt.hasValue( 278954 ) ).toBe( true );
    expect( dt.hasValue( -2014 ) ).toBe( true );
  } );
} );
