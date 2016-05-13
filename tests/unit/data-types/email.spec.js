console.log( 'Testing data-types/email.js...' );

const Email = require( '../../../source/data-types/email.js' );
const DataType = require( '../../../source/data-types/data-type.js' );

describe( 'Email type', () => {
  const dt = new Email();

  it( 'constructor returns a data type', () => {

    expect( dt ).toEqual( jasmine.any( DataType ) );
  } );

  it( 'has one read-only property', () => {
    dt.name = '---';

    expect( dt.name ).toBe( 'Email' );
  } );

  it( 'parse method expects an e-mail address', () => {
    function fn() {}

    expect( dt.parse() ).toBeNull();
    expect( dt.parse( null ) ).toBeNull();
    expect( dt.parse( true ) ).toBeUndefined();
    expect( dt.parse( 0 ) ).toBeUndefined();
    expect( dt.parse( '' ) ).toBeUndefined();
    expect( dt.parse( new Date() ) ).toBeUndefined();
    expect( dt.parse( 'Nile' ) ).toBeUndefined();
    expect( dt.parse( 'employee@company' ) ).toBeUndefined();
    expect( dt.parse( 'employee@company.com' ) ).toBe( 'employee@company.com' );
  } );

  it( 'hasValue method works', () => {

    expect( dt.hasValue() ).toBe( false );
    expect( dt.hasValue( '' ) ).toBe( false );
    expect( dt.hasValue( 'Nile' ) ).toBe( false );
    expect( dt.hasValue( null ) ).toBe( false );
    expect( dt.hasValue( 'employee@company.com' ) ).toBe( true );
  } );
} );
