console.log('Testing shared/configuration-reader.js...');

var configuration = require('../../../source/shared/configuration-reader.js');
var ConnectionManager = require('../../../data/connection-manager.js');
var NoAccessBehavior = require('../../../source/rules/no-access-behavior.js');
var daoBuilder = require('../../../source/data-access/dao-builder.js');

describe('Business objects configuration reader object', function() {

  // Initialize the test environment.
  configuration.initialize('/config/business-objects.js');

  it('has a connection manager object', function() {

    expect(configuration.connectionManager).toEqual(jasmine.any(ConnectionManager));

    var connection = configuration.connectionManager.openConnection('db');

    expect(connection.dataSource).toBe('db');
    expect(connection.connectionId).toBe(1);
    expect(connection.transactionId).toBeNull();

    connection = configuration.connectionManager.closeConnection('db', connection);

    expect(connection).toBeNull();

    var connection = configuration.connectionManager.beginTransaction('db');

    expect(connection.dataSource).toBe('db');
    expect(connection.connectionId).toBe(2);
    expect(connection.transactionId).toBe(1);

    connection = configuration.connectionManager.commitTransaction('db', connection);

    expect(connection).toBeNull();
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
