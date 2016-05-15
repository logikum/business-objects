console.log( 'Testing data-types/boolean.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const Boolean = read( 'data-types/boolean.js' );
const DataType = read( 'data-types/data-type.js' );

describe( 'Boolean type', () => {
  const dt = new Boolean();

  it( 'constructor returns a data type', () => {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has one read-only property', () => {
    dt.name = '---';

    expect( dt.name ).toBe( 'Boolean' );
  } );

  it( 'parse method expects Boolean', () => {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).toBe( true );
    expect( dt.parse( 0 ) ).toBe( false );
    expect( dt.parse( 3.1415926 ) ).toBe( true );
    expect( dt.parse( '' ) ).toBe( false );
    expect( dt.parse( 'Shakespeare' ) ).toBe( true );
    expect( dt.parse( new Date() ) ).toBe( true );
    expect( dt.parse( {} ) ).toBe( true );
    expect( dt.parse( [] ) ).toBe( true );
    expect( dt.parse( fn ) ).toBe( true );
    expect( dt.parse( 'false' ) ).toBe( false );
    expect( dt.parse( 'true' ) ).toBe( true );
  } );

  it( 'hasValue method works', () => {

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( false ) ).toBe( true );
    expect( dt.hasValue( true ) ).toBe( true );
  } );
} );
