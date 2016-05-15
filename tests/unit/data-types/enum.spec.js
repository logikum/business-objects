console.log( 'Testing data-types/enum.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const Enum = read( 'data-types/enum.js' );
const DataType = read( 'data-types/data-type.js' );
const ModelState = read( 'shared/model-state.js' );

describe( 'Enum type', () => {
  const dt = new Enum( ModelState );

  it( 'constructor returns a data type', () => {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has two read-only property', () => {
    dt.name = '---';
    dt.type = null;

    expect( dt.name ).toBe( 'Enum' );
    expect( dt.type ).toBe( ModelState );
  } );

  it( 'parse method expects enumeration item', () => {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).toBe( ModelState.created );
    expect( dt.parse( 3.1415926 ) ).toBeUndefined();
    expect( dt.parse( '' ) ).toBe( ModelState.pristine );
    expect( dt.parse( 'Shakespeare' ) ).toBeUndefined();
    expect( dt.parse( new Date() ) ).toBeUndefined();
    expect( dt.parse( ModelState.changed ) ).toBe( ModelState.changed );
    expect( dt.parse( 13 ) ).toBeUndefined();
    expect( dt.parse( '4' ) ).toBe( ModelState.removed );
  } );

  it( 'hasValue method works', () => {

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( -45672.78 ) ).toBe( false );
    expect( dt.hasValue( ModelState.count() ) ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( ModelState.pristine ) ).toBe( true );
    expect( dt.hasValue( ModelState.created ) ).toBe( true );
    expect( dt.hasValue( ModelState.changed ) ).toBe( true );
    expect( dt.hasValue( ModelState.markedForRemoval ) ).toBe( true );
    expect( dt.hasValue( ModelState.removed ) ).toBe( true );
  } );
} );
