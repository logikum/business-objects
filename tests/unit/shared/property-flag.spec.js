console.log( 'Testing shared/property-flag.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const PropertyFlag = read( 'common/property-flag.js' );

describe( 'Property flag', () => {

  it( 'has the defined items', () => {

    expect( PropertyFlag.none ).toBe( 0 );
    expect( PropertyFlag.readOnly ).toBe( 1 );
    expect( PropertyFlag.key ).toBe( 2 );
    expect( PropertyFlag.parentKey ).toBe( 4 );
    expect( PropertyFlag.onCtoOnly ).toBe( 8 );
    expect( PropertyFlag.onDtoOnly ).toBe( 16 );
  } );

  it( 'items are read-only', () => {
    PropertyFlag.none = 17;
    PropertyFlag.readOnly = 9;
    PropertyFlag.key = 10;
    PropertyFlag.parentKey = 11;
    PropertyFlag.onCtoOnly = 112;
    PropertyFlag.onDtoOnly = 113;

    expect( PropertyFlag.none ).toBe( 0 );
    expect( PropertyFlag.readOnly ).toBe( 1 );
    expect( PropertyFlag.key ).toBe( 2 );
    expect( PropertyFlag.parentKey ).toBe( 4 );
    expect( PropertyFlag.onCtoOnly ).toBe( 8 );
    expect( PropertyFlag.onDtoOnly ).toBe( 16 );
  } );
} );
