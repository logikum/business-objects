console.log( 'Testing rules/authorization-error.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const AuthorizationError = read( 'rules/authorization-error.js' );

describe( 'Data type error', () => {

  it( 'constructor expects one optional argument', () => {
    const ae1 = new AuthorizationError();
    const ae2 = new AuthorizationError( 'Only managers are allowed to view these data.' );
    const ae3 = new AuthorizationError( 'default' );

    expect( ae1 ).toEqual( jasmine.any( Error ) );
    expect( ae1.name ).toBe( 'AuthorizationError' );
    expect( ae1.message ).toBe( 'The user has no permission to execute the action.' );

    expect( ae2 ).toEqual( jasmine.any( Error ) );
    expect( ae2.name ).toBe( 'AuthorizationError' );
    expect( ae2.message ).toBe( 'Only managers are allowed to view these data.' );

    expect( ae3 ).toEqual( jasmine.any( Error ) );
    expect( ae3.name ).toBe( 'AuthorizationError' );
    expect( ae3.message ).toBe( 'The user has no permission to execute the action.' );
  } );
} );
