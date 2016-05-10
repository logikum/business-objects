console.log( 'Testing system/not-implemented-error.js...' );

const NotImplementedError = require( '../../../source/system/not-implemented-error.js' );

describe( 'Not implemented error', function () {

  it( 'constructor expects one optional argument', function () {
    const nie1 = new NotImplementedError();
    const nie2 = new NotImplementedError( 'Unexpected error occurred.' );
    const nie3 = new NotImplementedError( 'default' );

    expect( nie1 ).toEqual( jasmine.any( Error ) );
    expect( nie1.name ).toBe( 'NotImplementedError' );
    expect( nie1.message ).toBe( 'The method is not implemented.' );

    expect( nie2 ).toEqual( jasmine.any( Error ) );
    expect( nie2.name ).toBe( 'NotImplementedError' );
    expect( nie2.message ).toBe( 'Unexpected error occurred.' );

    expect( nie3 ).toEqual( jasmine.any( Error ) );
    expect( nie3.name ).toBe( 'NotImplementedError' );
    expect( nie3.message ).toBe( 'The method is not implemented.' );
  } );
} );
