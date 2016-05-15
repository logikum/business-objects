console.log( 'Testing data-access/index.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const da = read( 'data-access/index.js' );

describe( 'Data access index', () => {

  it( 'returns correct data types', () => {

    expect( da.ConnectionManagerBase ).toEqual( jasmine.any( Function ) );
    expect( da.daoBuilder ).toEqual( jasmine.any( Function ) );
    expect( da.DaoBase ).toEqual( jasmine.any( Function ) );
    expect( da.DaoContext ).toEqual( jasmine.any( Function ) );
    expect( da.DaoError ).toEqual( jasmine.any( Function ) );
  } );
} );
