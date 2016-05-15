console.log( 'Testing data-access/dao-builder.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const path = require( 'path' );
const DaoBuilder = read( 'data-access/dao-builder.js' );
const DaoBase = read( 'data-access/dao-base.js' );

describe( 'Data access object builder', () => {

  it( 'is a function', () => {

    expect( typeof DaoBuilder === 'function' ).toBe( true );
  } );

  it( 'works', () => {
    const p = path.join( __dirname, '../../../data/widget.js' );
    const dao = DaoBuilder( 'dao', p, 'Horus' );

    expect( dao ).toEqual( jasmine.any( DaoBase ) );
    expect( dao.name ).toBe( 'WidgetDao' );
    expect( dao.select() ).toBe( 'Hello, world!' );
  } );
} );
