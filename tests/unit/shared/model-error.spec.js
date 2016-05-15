console.log( 'Testing shared/model-error.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ModelError = read( 'shared/model-error.js' );

describe( 'Model error', () => {

  it( 'constructor expects an optional message', () => {

    const me1 = new ModelError();
    const me2 = new ModelError( 'The model definition is bad.' );

    expect( me1 ).toEqual( jasmine.any( Error ) );
    expect( me1.name ).toBe( 'ModelError' );
    expect( me1.message ).toBe( 'An error occurred in the model.' );

    expect( me2 ).toEqual( jasmine.any( Error ) );
    expect( me2.name ).toBe( 'ModelError' );
    expect( me2.message ).toBe( 'The model definition is bad.' );
  } );
} );
