console.log( 'Testing data-types/text.js...' );

const Text = require( '../../../source/data-types/text.js' );
const DataType = require( '../../../source/data-types/data-type.js' );

describe( 'Text type', () => {
  const dt = new Text();

  it( 'constructor returns a data type', () => {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has one read-only property', () => {
    dt.name = '---';

    expect( dt.name ).toBe( 'Text' );
  } );

  it( 'parse method expects string', () => {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).toBe( 'true' );
    expect( dt.parse( 0 ) ).toBe( '0' );
    expect( dt.parse( 3.1415926 ) ).toBe( '3.1415926' );
    expect( dt.parse( '' ) ).toBe( '' );
    expect( dt.parse( 'Shakespeare' ) ).toBe( 'Shakespeare' );
    expect( dt.parse( new Date() ) ).toBeGreaterThan( '0' );
    expect( dt.parse( {} ) ).toBe( '[object Object]' );
    expect( dt.parse( [] ) ).toBe( '' );
    expect( dt.parse( fn ) ).toBe( 'function fn() {}' );
  } );

  it( 'hasValue method works', () => {

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( '' ) ).toBe( false );
    expect( dt.hasValue( 'Shakespeare' ) ).toBe( true );
  } );
} );
