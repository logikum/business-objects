console.log( 'Testing shared/client-transfer-context.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ClientTransferContext = read( 'shared/client-transfer-context.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const Text = read( 'data-types/text.js' );

describe( 'Transfer context', () => {

  const pi = new PropertyInfo( 'property', new Text() );
  let propertyValue = 125;

  function readValue( property ) {
    return property.name === 'property' ? propertyValue : null;
  }
  function writeValue( property, value ) {
    propertyValue = property.name === 'property' ? value : null;
  }
  const ctx = new ClientTransferContext( [ pi ], readValue, writeValue );

  it( 'constructor expects three arguments', () => {

    function create01() { return new ClientTransferContext(); }
    function create02() { return new ClientTransferContext( 1, 2, 3 ); }
    function create03() { return new ClientTransferContext( '1', '2', '3' ); }
    function create04() { return new ClientTransferContext( [ pi ] ); }
    function create05() { return new ClientTransferContext( [ pi ], readValue ); }
    function create06() { return new ClientTransferContext( [ pi ], readValue, writeValue ); }
    function create07() { return new ClientTransferContext( [ pi ], null, writeValue ); }
    function create08() { return new ClientTransferContext( [ pi ], readValue, {} ); }
    function create09() { return new ClientTransferContext( [ pi ], {}, writeValue ); }
    function create10() { return new ClientTransferContext( null, readValue, writeValue ); }

    expect( create01 ).not.toThrow();
    expect( create02 ).toThrow( 'The properties argument of ClientTransferContext constructor must be an array of PropertyInfo objects, or a single PropertyInfo object or null.' );
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
    ctx.readValue = null;
    ctx.writeValue = null;

    expect( ctx.properties ).not.toBeNull();
  } );

  it( 'readValue method works', () => {

    const ctxReadOnly = new ClientTransferContext( [ pi ], null, writeValue );

    function get01() { return ctx.readValue(); }
    function get02() { return ctxReadOnly.readValue( 'property' ); }

    expect( ctx.readValue( 'property' ) ).toBe( 125 );
    expect( get01 ).toThrow( 'The propertyName argument of ClientTransferContext.readValue method must be a non-empty string.' );
    expect( get02 ).toThrow( 'An error occurred in the model.' );
  } );

  it( 'writeValue method works', () => {

    const ctxReadOnly = new ClientTransferContext( [ pi ], readValue, null );
    ctx.writeValue( 'property', 1001 );

    function set01() { ctx.writeValue( 1001 ); }
    function set02() { ctxReadOnly.writeValue( 'property', 1001 ); }

    expect( ctx.readValue( 'property' ) ).toBe( 1001 );
    expect( set01 ).toThrow( 'The propertyName argument of ClientTransferContext.writeValue method must be a non-empty string.' );
    expect( set02 ).toThrow( "Read-only model's properties cannot be copied from client transfer object." );
  } );
} );
