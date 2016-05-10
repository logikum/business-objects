console.log( 'Testing data-types/index.js...' );

const dt = require( '../../../source/data-types/index.js' );
//const DataType = require('../../../source/data-types/data-type.js');
const Boolean = require( '../../../source/data-types/boolean.js' );
const Text = require( '../../../source/data-types/text.js' );
const Email = require( '../../../source/data-types/email.js' );
const Integer = require( '../../../source/data-types/integer.js' );
const Decimal = require( '../../../source/data-types/decimal.js' );
//const Enum = require('../../../source/data-types/enum.js');
const DateTime = require( '../../../source/data-types/date-time.js' );

describe( 'Data type index', function () {

  it( 'returns correct data types', function () {

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
