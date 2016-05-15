console.log( '' );
console.log( '--------------------------------------------------' );
console.log( 'Initializing test environment...' );
console.log( '--------------------------------------------------' );

function read ( filename ) {
  return require( '../../source/' + filename );
}
const configuration = read( 'system/configuration-reader.js' );
//const i18n = read( 'locales/i18n.js' );

configuration.initialize( '/config/business-objects.js' );
//i18n.initialize( configuration.pathOfLocales, configuration.getLocale );

describe( 'Test repository', () => {

  it( 'initialization', () => {

    expect( true ).toBe( true );
  } );
} );
