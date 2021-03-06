console.log( 'Testing system/configuration-reader.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}

const configuration = read( 'system/configuration-reader.js' );
const NoAccessBehavior = read( 'rules/no-access-behavior.js' );
const BrokenRulesOutput = read( 'rules/broken-rules-output.js' );
const BrokenRulesResponse = read( 'rules/broken-rules-response.js' );
const daoBuilder = read( 'data-access/dao-builder.js' );

const ConnectionManager = require( '../../../data/connection-manager.js' );

describe( 'Business objects configuration reader object', () => {

  it( 'has a connection manager object', done => {

    expect( configuration.connectionManager ).toEqual( jasmine.any( ConnectionManager ) );

    configuration.connectionManager.openConnection( 'db' )
      .then( connection => {

        expect( connection.dataSource ).toBe( 'db' );
        expect( connection.connectionId ).toBe( 1 );
        expect( connection.transactionId ).toBeNull();

        return connection;
      } )
      .then( connection => {

        return configuration.connectionManager.closeConnection( 'db', connection )
          .then( connection => {

            expect( connection ).toBeNull();

            return null;
          } );
      } )
      .then( none => {

        return configuration.connectionManager.beginTransaction( 'db' )
          .then( connection => {

            expect( connection.dataSource ).toBe( 'db' );
            expect( connection.connectionId ).toBe( 2 );
            expect( connection.transactionId ).toBe( 1 );

            return connection;
          } );
      } )
      .then( connection => {

        return configuration.connectionManager.commitTransaction( 'db', connection )
          .then( connection => {

            expect( connection ).toBeNull();

            done();
          } );
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'has a data access object builder method', () => {

    expect( configuration.daoBuilder ).toBe( daoBuilder );
  } );

  it( 'has a user reader method', () => {

    const user = configuration.getUser();

    expect( user ).toEqual( jasmine.any( Object ) );
    expect( user.userCode ).toBe( 'ada-lovelace' );
    expect( user.userName ).toBe( 'Ada Lovelace' );
    expect( user.email ).toBe( 'ada.lovelace@computer.net' );
    expect( user.roles ).toContain( 'administrators' );
  } );

  it( 'can have a no access behavior property', () => {

    expect( configuration.noAccessBehavior ).toBe( NoAccessBehavior.throwError );
  } );

  it( 'has a property for the path of locales', () => {

    expect( configuration.pathOfLocales.substr( -8 ) ).toBe( '/locales' );
  } );

  it( 'has a locale reader method', () => {

    expect( configuration.getLocale ).toEqual( jasmine.any( Function ) );

    const locale = configuration.getLocale();

    expect( locale ).toBe( 'hu-HU' );
  } );

  it( 'has a broken rules response method', () => {

    expect( configuration.brokenRulesResponse ).toEqual( jasmine.any( Function ) );

    const bro = new BrokenRulesOutput();
    const brr = new configuration.brokenRulesResponse( bro, 'Error occurred!' );

    expect( brr ).toEqual( jasmine.any( BrokenRulesResponse ) );
    expect( brr.name ).toBe( 'BrokenRules' );
    expect( brr.status ).toBe( 422 );
    expect( brr.message ).toBe( 'Error occurred!' );
    expect( brr.data ).toBe( bro );
  } );

  it( 'is immutable', () => {

    const init = function () {
      configuration.initialize( '/config/business-objects.js' );
    };
    const extent = function () {
      configuration.extent = '/config/business-objects.js';
      return configuration.extent;
    };

    expect( init ).toThrow();
    expect( extent() ).toBeUndefined();
  } );
} );
