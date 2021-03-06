console.log( 'Testing system/enumeration-error.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const EnumerationError = read( 'system/enumeration-error.js' );

describe( 'Enumeration error', () => {

  it( 'constructor expects an optional message', () => {
    const ee1 = new EnumerationError();
    const ee2 = new EnumerationError( 'The passed value is not an enumeration member.' );
    const ee3 = new EnumerationError( 'default' );

    expect( ee1 ).toEqual( jasmine.any( Error ) );
    expect( ee1.name ).toBe( 'EnumerationError' );
    expect( ee1.message ).toBe( 'An enumeration error occurred.' );

    expect( ee2 ).toEqual( jasmine.any( Error ) );
    expect( ee2.name ).toBe( 'EnumerationError' );
    expect( ee2.message ).toBe( 'The passed value is not an enumeration member.' );

    expect( ee3 ).toEqual( jasmine.any( Error ) );
    expect( ee3.name ).toBe( 'EnumerationError' );
    expect( ee3.message ).toBe( 'An enumeration error occurred.' );
  } );
} );
