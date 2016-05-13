console.log( 'Testing data-types/data-type.js...' );

const DataType = require( '../../../source/data-types/data-type.js' );

describe( 'Base data type', () => {
  let dt = null;

  it( 'constructor expects no argument', () => {
    var build01 = () => { dt = new DataType(); };

    expect( build01 ).not.toThrow();
  } );

  it( 'has one property', () => {

    expect( dt.name ).toBe( 'DataType' );
  } );

  it( 'has two not implemented methods', () => {
    function call1() { dt.parse( 1 ); }
    function call2() { dt.hasValue( 2 ); }

    expect( call1 ).toThrow( 'The DataType.parse method is not implemented.' );
    expect( call2 ).toThrow( 'The DataType.hasValue method is not implemented.' );
  } );
} );
