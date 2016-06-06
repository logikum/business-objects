console.log( 'Testing common/model-type.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ModelType = read( 'common/model-type.js' );

describe( 'Model type constants', () => {

  it( 'are read-only', () => {

    expect( ModelType.constructor.name ).toBe( 'ModelType' );

    ModelType.EditableRootObject = 'arab';
    ModelType.CommandObject = 'zulu' ;
    ModelType.Tree = 'mahogany' ;

    expect( ModelType.EditableRootObject ).toBe( 'EditableRootObject' );
    expect( ModelType.CommandObject ).toBe( 'CommandObject' );
    expect( ModelType.Tree ).toBeUndefined();
  } );

  it( 'have the defined values', () => {

    expect( ModelType.EditableRootObject ).toBe( 'EditableRootObject' );
    expect( ModelType.EditableRootCollection ).toBe( 'EditableRootCollection' );
    expect( ModelType.EditableChildObject ).toBe( 'EditableChildObject' );
    expect( ModelType.EditableChildCollection ).toBe( 'EditableChildCollection' );
    expect( ModelType.ReadOnlyRootObject ).toBe( 'ReadOnlyRootObject' );
    expect( ModelType.ReadOnlyRootCollection ).toBe( 'ReadOnlyRootCollection' );
    expect( ModelType.ReadOnlyChildObject ).toBe( 'ReadOnlyChildObject' );
    expect( ModelType.ReadOnlyChildCollection ).toBe( 'ReadOnlyChildCollection' );
    expect( ModelType.CommandObject ).toBe( 'CommandObject' );
  } );
} );
