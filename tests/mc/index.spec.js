const bo = require( '../../source/index.js' );

function showTitle() {
  console.log( '' );
  console.log( '--------------------------------------------------' );
  console.log( 'Testing index.js...' );
  console.log( '--------------------------------------------------' );
}

describe( 'Business object index', () => {

  it( 'returns correct data types', () => {
    showTitle();

    expect( bo.ModelComposer ).toEqual( jasmine.any( Function ) );

    expect( bo.EditableRootObject ).toEqual( jasmine.any( Function ) );
    expect( bo.EditableChildObject ).toEqual( jasmine.any( Function ) );
    expect( bo.EditableChildCollection ).toEqual( jasmine.any( Function ) );
    expect( bo.ReadOnlyRootObject ).toEqual( jasmine.any( Function ) );
    expect( bo.ReadOnlyChildObject ).toEqual( jasmine.any( Function ) );
    expect( bo.ReadOnlyRootCollection ).toEqual( jasmine.any( Function ) );
    expect( bo.ReadOnlyChildCollection ).toEqual( jasmine.any( Function ) );
    expect( bo.CommandObject ).toEqual( jasmine.any( Function ) );

    expect( bo.commonRules ).toEqual( jasmine.any( Object ) );
    expect( bo.dataAccess ).toEqual( jasmine.any( Object ) );
    expect( bo.dataTypes ).toEqual( jasmine.any( Object ) );
    expect( bo.rules ).toEqual( jasmine.any( Object ) );
    expect( bo.shared ).toEqual( jasmine.any( Object ) );
    expect( bo.system ).toEqual( jasmine.any( Object ) );

    expect( bo.configuration ).toEqual( jasmine.any( Function ) );
    expect( bo.i18n ).toEqual( jasmine.any( Function ) );
  } );
} );
