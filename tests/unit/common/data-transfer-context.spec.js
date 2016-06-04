console.log( 'Testing common/data-transfer-context.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const DataTransferContext = read( 'common/data-transfer-context.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );

describe( 'Transfer context', () => {

  const pi = new PropertyInfo( 'property', new Text() );
  let propertyValue = 125;

  function getValue( property ) {
    return property.name === 'property' ? propertyValue : null;
  }
  function setValue( property, value ) {
    propertyValue = property.name === 'property' ? value : null;
  }
  const ctx = new DataTransferContext( [ pi ], getValue, setValue );

  it( 'constructor expects three arguments', () => {

    function create01() { return new DataTransferContext(); }
    function create02() { return new DataTransferContext( 1, 2, 3 ); }
    function create03() { return new DataTransferContext( '1', '2', '3' ); }
    function create04() { return new DataTransferContext( [ pi ] ); }
    function create05() { return new DataTransferContext( [ pi ], getValue ); }
    function create06() { return new DataTransferContext( [ pi ], getValue, setValue ); }
    function create07() { return new DataTransferContext( [ pi ], null, setValue ); }
    function create08() { return new DataTransferContext( [ pi ], getValue, {} ); }
    function create09() { return new DataTransferContext( [ pi ], {}, setValue ); }
    function create10() { return new DataTransferContext( null, getValue, setValue ); }

    expect( create01 ).not.toThrow();
    expect( create02 ).toThrow( 'The properties argument of DataTransferContext constructor must be an array of PropertyInfo objects, or a single PropertyInfo object or null.' );
    expect( create03 ).toThrow();
    expect( create04 ).not.toThrow();
    expect( create05 ).not.toThrow();
    expect( create06 ).not.toThrow();
    expect( create07 ).not.toThrow();
    expect( create08 ).toThrow();
    expect( create09 ).toThrow();
    expect( create10 ).not.toThrow();
  } );

  it( 'has one property', () => {

    expect( ctx.properties ).toEqual( jasmine.any( Array ) );
  } );

  it( 'has a read-only property', () => {

    ctx.properties = null;
    ctx.getValue = null;
    ctx.setValue = null;

    expect( ctx.properties ).not.toBeNull();
  } );

  it( 'getValue method works', () => {

    const ctxReadOnly = new DataTransferContext( [ pi ], null, setValue );

    function get01() { return ctx.getValue(); }
    function get02() { return ctxReadOnly.getValue( 'property' ); }

    expect( ctx.getValue( 'property' ) ).toBe( 125 );
    expect( get01 ).toThrow( 'The propertyName argument of DataTransferContext.getValue method must be a non-empty string.' );
    expect( get02 ).toThrow( "Read-only model's properties cannot be copied to data transfer object." );
  } );

  it( 'setValue method works', () => {

    const ctxReadOnly = new DataTransferContext( [ pi ], getValue, null );
    ctx.setValue( 'property', 1001 );

    function set01() { ctx.setValue( 1001 ); }
    function set02() { ctxReadOnly.setValue( 'property', 1001 ); }

    expect( ctx.getValue( 'property' ) ).toBe( 1001 );
    expect( set01 ).toThrow( 'The propertyName argument of DataTransferContext.setValue method must be a non-empty string.' );
    expect( set02 ).toThrow( 'An error occurred in the model.' );
  } );
} );
