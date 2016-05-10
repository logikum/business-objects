console.log( 'Testing system/constructor-error.js...' );

const ConstructorError = require( '../../../source/system/constructor-error.js' );

describe( 'Constructor error', function () {

  it( 'constructor expects an optional message', function () {
    const ce1 = new ConstructorError();
    const ce2 = new ConstructorError( 'The argument is null or invalid.' );
    const ce3 = new ConstructorError( 'default' );

    expect( ce1 ).toEqual( jasmine.any( Error ) );
    expect( ce1.name ).toBe( 'ConstructorError' );
    expect( ce1.message ).toBe( 'The value passed to the constructor is invalid.' );

    expect( ce2 ).toEqual( jasmine.any( Error ) );
    expect( ce2.name ).toBe( 'ConstructorError' );
    expect( ce2.message ).toBe( 'The argument is null or invalid.' );

    expect( ce3 ).toEqual( jasmine.any( Error ) );
    expect( ce3.name ).toBe( 'ConstructorError' );
    expect( ce3.message ).toBe( 'The value passed to the constructor is invalid.' );
  } );
} );
