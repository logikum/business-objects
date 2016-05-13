console.log( 'Testing system/method-error.js...' );

const MethodError = require( '../../../source/system/method-error.js' );

describe( 'Method error', () => {

  it( 'constructor expects an optional message', () => {
    const me1 = new MethodError();
    const me2 = new MethodError( 'The argument is null or invalid.' );
    const me3 = new MethodError( 'default' );

    expect( me1 ).toEqual( jasmine.any( Error ) );
    expect( me1.name ).toBe( 'MethodError' );
    expect( me1.message ).toBe( 'The value passed to the method is invalid.' );

    expect( me2 ).toEqual( jasmine.any( Error ) );
    expect( me2.name ).toBe( 'MethodError' );
    expect( me2.message ).toBe( 'The argument is null or invalid.' );

    expect( me3 ).toEqual( jasmine.any( Error ) );
    expect( me3.name ).toBe( 'MethodError' );
    expect( me3.message ).toBe( 'The value passed to the method is invalid.' );
  } );
} );
