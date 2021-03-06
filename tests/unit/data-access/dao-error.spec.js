console.log( 'Testing data-access/data-type-error.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const DaoError = read( 'data-access/dao-error.js' );

describe( 'Data access object error', () => {

  it( 'constructor expects optional arguments', () => {
    const de1 = new DaoError();
    const de2 = new DaoError( 'The data access object is wrong.' );
    const de3 = new DaoError( 'default' );
    const de4 = new DaoError( 'Test failed: {0} != {1}', 13, 1024 );

    expect( de1 ).toEqual( jasmine.any( Error ));
    expect( de1.name ).toBe( 'DaoError' );
    expect( de1.message ).toBe( 'A data access object error occurred.' );

    expect( de2 ).toEqual( jasmine.any( Error ));
    expect( de2.name ).toBe( 'DaoError' );
    expect( de2.message ).toBe( 'The data access object is wrong.' );

    expect( de3 ).toEqual( jasmine.any( Error ));
    expect( de3.name ).toBe( 'DaoError' );
    expect( de3.message ).toBe( 'A data access object error occurred.' );

    expect( de4 ).toEqual( jasmine.any( Error ));
    expect( de4.name ).toBe( 'DaoError' );
    expect( de4.message ).toBe( 'Test failed: 13 != 1024' );
  });
});
