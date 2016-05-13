console.log( 'Testing shared/configuration-error.js...' );

const ConfigurationError = require( '../../../source/shared/configuration-error.js' );

describe( 'Configuration error', () => {

  it( 'constructor expects an optional message', () => {

    const me1 = new ConfigurationError();
    const me2 = new ConfigurationError( 'The configuration definition is bad.' );

    expect( me1 ).toEqual( jasmine.any( Error ) );
    expect( me1.name ).toBe( 'ConfigurationError' );
    expect( me1.message ).toBe( "An error occurred in the business objects' configuration." );

    expect( me2 ).toEqual( jasmine.any( Error ) );
    expect( me2.name ).toBe( 'ConfigurationError' );
    expect( me2.message ).toBe( 'The configuration definition is bad.' );
  } );
} );
