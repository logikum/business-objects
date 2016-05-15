console.log( 'Testing system/composer-error.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ComposerError = read( 'system/composer-error.js' );

describe( 'Composer error', () => {

  it( 'constructor expects an optional message', () => {
    const ae1 = new ComposerError();
    const ae2 = new ComposerError( 'The argument is null or invalid.' );
    const ae3 = new ComposerError( 'default' );
    ae3.modelName = 'Point';
    ae3.modelType = 'EditableRootObject';
    ae3.methodName = 'property';

    expect( ae1 ).toEqual( jasmine.any( Error ) );
    expect( ae1.name ).toBe( 'ComposerError' );
    expect( ae1.message ).toBe( 'The model composer found an error in the class definition.' );
    expect( ae1.modelName ).toBe( '' );
    expect( ae1.modelType ).toBe( '' );
    expect( ae1.methodName ).toBe( '' );

    expect( ae2 ).toEqual( jasmine.any( Error ) );
    expect( ae2.name ).toBe( 'ComposerError' );
    expect( ae2.message ).toBe( 'The argument is null or invalid.' );

    expect( ae3 ).toEqual( jasmine.any( Error ) );
    expect( ae3.name ).toBe( 'ComposerError' );
    expect( ae3.message ).toBe( 'The model composer found an error in the class definition.' );
    expect( ae3.modelName ).toBe( 'Point' );
    expect( ae3.modelType ).toBe( 'EditableRootObject' );
    expect( ae3.methodName ).toBe( 'property' );
  } );
} );
