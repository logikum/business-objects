console.log( 'Testing shared/transfer-context.js...' );

const TransferContext = require( '../../../source/shared/transfer-context.js' );
const PropertyInfo = require( '../../../source/shared/property-info.js' );
const Text = require( '../../../source/data-types/text.js' );

describe( 'Transfer context', () => {

  const pi = new PropertyInfo( 'property', new Text() );
  let propertyValue = 125;

  function getValue( property ) {
    return property.name === 'property' ? propertyValue : null;
  }
  function setValue( property, value ) {
    propertyValue = property.name === 'property' ? value : null;
  }
  const ctx = new TransferContext( [ pi ], getValue, setValue );

  it( 'constructor expects three arguments', () => {

    function create01() { return new TransferContext(); }
    function create02() { return new TransferContext( 1, 2, 3 ); }
    function create03() { return new TransferContext( '1', '2', '3' ); }
    function create04() { return new TransferContext( [ pi ] ); }
    function create05() { return new TransferContext( [ pi ], getValue ); }
    function create06() { return new TransferContext( [ pi ], getValue, setValue ); }
    function create07() { return new TransferContext( [ pi ], null, setValue ); }
    function create08() { return new TransferContext( [ pi ], getValue, {} ); }
    function create09() { return new TransferContext( [ pi ], {}, setValue ); }
    function create10() { return new TransferContext( null, getValue, setValue ); }

    expect( create01 ).not.toThrow();
    expect( create02 ).toThrow();
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

    const ctxReadOnly = new TransferContext( [ pi ], null, setValue );
    function get01() { const v = ctxReadOnly.getValue( 'property' ); }

    expect( ctx.getValue( 'property' ) ).toBe( 125 );
    expect( get01 ).toThrow( "Read-only model's properties cannot be copied to data transfer object." );
  } );

  it( 'setValue method works', () => {

    const ctxReadOnly = new TransferContext( [ pi ], getValue, null );
    ctx.setValue( 'property', 1001 );
    function set01() { ctxReadOnly.setValue( 'property', 1001 ); }

    expect( ctx.getValue( 'property' ) ).toBe( 1001 );
    expect( set01 ).toThrow( "Read-only model's properties cannot be copied from client transfer object." );
  } );
} );
