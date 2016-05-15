console.log( 'Testing data-types/index.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const dt = read( 'data-types/index.js' );
//const DataType = read( 'data-types/data-type.js' );
const Boolean = read( 'data-types/boolean.js' );
const Text = read( 'data-types/text.js' );
const Email = read( 'data-types/email.js' );
const Integer = read( 'data-types/integer.js' );
const Decimal = read( 'data-types/decimal.js' );
//const Enum = read( 'data-types/enum.js' );
const DateTime = read( 'data-types/date-time.js' );

describe( 'Data type index', () => {

  it( 'returns correct data types', () => {

    expect( dt.DataType ).toEqual( jasmine.any( Function ) );

    expect( dt.Boolean ).toEqual( jasmine.any( Boolean ) );
    expect( dt.Text ).toEqual( jasmine.any( Text ) );
    expect( dt.Email ).toEqual( jasmine.any( Email ) );
    expect( dt.Integer ).toEqual( jasmine.any( Integer ) );
    expect( dt.Decimal ).toEqual( jasmine.any( Decimal ) );
    expect( dt.Enum ).toEqual( jasmine.any( Function ) );
    expect( dt.DateTime ).toEqual( jasmine.any( DateTime ) );
  } );
} );
