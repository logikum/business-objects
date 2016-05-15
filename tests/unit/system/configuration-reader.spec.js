console.log('Testing system/configuration-reader.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var configuration = read( 'system/configuration-reader.js');
var NoAccessBehavior = read( 'rules/no-access-behavior.js');
var daoBuilder = read( 'data-access/dao-builder.js');

var ConnectionManager = require('../../../data/connection-manager.js');

describe('Business objects configuration reader object', function() {

  it('has a connection manager object', done => {

    expect(configuration.connectionManager).toEqual(jasmine.any(ConnectionManager));

    configuration.connectionManager.openConnection('db')
      .then( connection => {

        expect(connection.dataSource).toBe('db');
        expect(connection.connectionId).toBe(1);
        expect(connection.transactionId).toBeNull();

        return connection;
      })
      .then( connection => {

        return configuration.connectionManager.closeConnection('db', connection)
          .then( connection => {

            expect(connection).toBeNull();

            return null;
          });
      })
      .then( none => {

        return configuration.connectionManager.beginTransaction('db')
          .then( connection => {

            expect(connection.dataSource).toBe('db');
            expect(connection.connectionId).toBe(2);
            expect(connection.transactionId).toBe(1);

            return connection;
          });
      })
      .then( connection => {

        return configuration.connectionManager.commitTransaction('db', connection)
          .then( connection => {

            expect(connection).toBeNull();

            done();
          });
      })
      .catch( reason => {
        console.log( reason );
      });
  });

  it('has a data access object builder method', function() {

    expect(configuration.daoBuilder).toBe(daoBuilder);
  });

  it('has a user reader method', function() {
    var user = configuration.getUser();

    expect(user).toEqual(jasmine.any(Object));
    expect(user.userCode).toBe('ada-lovelace');
    expect(user.userName).toBe('Ada Lovelace');
    expect(user.email).toBe('ada.lovelace@computer.net');
    expect(user.roles).toContain('administrators');
  });

  it('can have a no access behavior property', function() {

    expect(configuration.noAccessBehavior).toBe(NoAccessBehavior.throwError);
  });

  it('has a property for the path of locales', function() {

    expect(configuration.pathOfLocales.substr(-8)).toBe('/locales');
  });

  it('has a locale reader method', function() {

    expect(configuration.getLocale).toEqual(jasmine.any(Function));

    var locale = configuration.getLocale();

    expect(locale).toBe('hu-HU');
  });
});
