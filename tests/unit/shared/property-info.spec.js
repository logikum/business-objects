console.log( 'Testing shared/property-info.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const PropertyInfo = read( 'common/property-info.js' );
const F = read( 'common/property-flag.js' );
const DataType = read( 'data-types/data-type.js' );
const Text = read( 'data-types/text.js' );
const CollectionBase = read( 'common/collection-base.js' );

describe( 'Property description', () => {

  const items = new CollectionBase();
  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects two or three arguments', () => {

    function create1() { return new PropertyInfo(); }
    function create2() { return new PropertyInfo( null ); }
    function create3() { return new PropertyInfo( 1, 2 ); }
    function create4() { return new PropertyInfo( '1', '2', '3' ); }

    const pi1 = new PropertyInfo( 'property', items );
    const pi2 = new PropertyInfo( 'property', new Text() );
    const pi3 = new PropertyInfo( 'property', items, F.readOnly );
    const pi4 = new PropertyInfo( 'property', new Text(), F.key | F.onDtoOnly );

    expect( create1 ).toThrow( 'The name argument of PropertyInfo constructor must be a non-empty string.' );
    expect( create2 ).toThrow();
    expect( create3 ).toThrow();
    expect( create4 ).toThrow();

    expect( pi1.name ).toBe( 'property' );
    expect( pi2.name ).toBe( 'property' );
    expect( pi3.name ).toBe( 'property' );
    expect( pi4.name ).toBe( 'property' );
  } );

  it( 'has seven properties', () => {

    expect( pi.name ).toBe( 'property' );
    expect( pi.type ).toEqual( jasmine.any( DataType ) );
    expect( pi.isReadOnly ).toBe( false );
    expect( pi.isKey ).toBe( false );
    expect( pi.isParentKey ).toBe( false );
    expect( pi.isOnDto ).toBe( true );
    expect( pi.isOnCto ).toBe( true );
  } );

  it( 'has read-only properties', () => {

    pi.name = null;
    pi.type = null;
    pi.isReadOnly = true;
    pi.isKey = true;
    pi.isParentKey = true;
    pi.isOnDto = false;
    pi.isOnCto = false;

    expect( pi.name ).not.toBeNull();
    expect( pi.type ).not.toBeNull();
    expect( pi.isReadOnly ).toBe( false );
    expect( pi.isKey ).toBe( false );
    expect( pi.isParentKey ).toBe( false );
    expect( pi.isOnDto ).toBe( true );
    expect( pi.isOnCto ).toBe( true );
  } );

  it( 'hasValue method works', () => {

    expect( pi.hasValue( null ) ).toBe( false );
    expect( pi.hasValue( undefined ) ).toBe( false );
    expect( pi.hasValue( '' ) ).toBe( false );
    expect( pi.hasValue( 'hasValue' ) ).toBe( true );
  } );
} );
