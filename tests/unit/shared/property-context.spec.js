console.log('Testing shared/property-context.js...');

function read( filename ) {
  return require( '../../../source/' + filename );
}
const PropertyContext = read( 'shared/property-context.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const Text = read( 'data-types/text.js' );

describe( 'Property context', () => {

  const properties = [ new PropertyInfo( 'scores', new Text() ) ];
  const data = { scores: 123 };

  function getValue( property ) {
    return data[ property.name ];
  }
  function setValue( property, value ) {
    data[ property.name ] = value;
  }
  const ctx = new PropertyContext( 'model', properties, getValue, setValue );

  it( 'constructor expects zero-three arguments', () => {

    function create01() { return new PropertyContext(); }
    function create02() { return new PropertyContext( 1 ); }
    function create03() { return new PropertyContext( '1' ); }
    function create04() { return new PropertyContext( true, false ); }
    function create05() { return new PropertyContext( { property: 'property' } ); }
    function create06() { return new PropertyContext( [ 'property' ] ); }
    function create07() { return new PropertyContext( 'a', properties ); }
    function create08() { return new PropertyContext( 'b', properties, getValue ); }
    function create09() { return new PropertyContext( 'c', properties, undefined, setValue ); }
    function create10() { return new PropertyContext( 'd', properties, getValue, setValue ); }

    expect( create01 ).toThrow();
    expect( create02 ).toThrow();
    expect( create03 ).not.toThrow();
    expect( create04 ).toThrow();
    expect( create05 ).toThrow();
    expect( create06 ).toThrow();
    expect( create07 ).not.toThrow();
    expect( create08 ).not.toThrow();
    expect( create09 ).not.toThrow();
    expect( create10 ).not.toThrow();
  } );

  it( 'has two properties', () => {

    expect( ctx.primaryProperty ).toBeNull();
    expect( ctx.properties ).toBe( properties );
  } );

  it( 'has read-only properties', () => {

    ctx.primaryProperty = new PropertyInfo( 'scores', new Text() );
    ctx.properties = null;

    expect( ctx.primaryProperty ).toBeNull();
    expect( ctx.properties ).toBe( properties );
  } );

  it( 'with method works', () => {

    const property = new PropertyInfo( 'scores', new Text() );
    const result = ctx.with( property );

    expect( ctx.primaryProperty ).toBe( property );
  } );

  it( 'getValue and setValue methods work', () => {

    const scores1 = ctx.getValue( 'scores' );
    ctx.setValue( 'scores', -1 );
    const scores2 = ctx.getValue( 'scores' );

    expect( scores1 ).toBe( 123 );
    expect( scores2 ).toBe( -1 );
  } );
} );
