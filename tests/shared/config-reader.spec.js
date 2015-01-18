console.log('Testing shared/config-reader.js...');

var path = require('path');
var ConnectionManager = require('../../sample/connection-manager.js');
var ConfigReader = require('../../source/shared/config-reader.js');
var NoAccessBehavior = require('../../source/rules/no-access-behavior.js');
var daoBuilder = require('../../source/data-access/dao-builder.js');
var getLocale = require('../../sample/get-locale.js');

describe('Business objects configuration reader object', function() {

  it('has a connection manager object', function() {

    expect(ConfigReader.connectionManager).toEqual(jasmine.any(ConnectionManager));

    var connection = ConfigReader.connectionManager.openConnection('db');

    expect(connection.dataSource).toBe('db');
    expect(connection.connectionId).toBe(1);
    expect(connection.transactionId).toBeNull();

    connection = ConfigReader.connectionManager.closeConnection('db', connection);

    expect(connection).toBeNull();

    var connection = ConfigReader.connectionManager.beginTransaction('db');

    expect(connection.dataSource).toBe('db');
    expect(connection.connectionId).toBe(2);
    expect(connection.transactionId).toBe(1);

    connection = ConfigReader.connectionManager.commitTransaction('db', connection);

    expect(connection).toBeNull();
  });

  it('has a data access object builder method', function() {

    expect(ConfigReader.daoBuilder).toBe(daoBuilder);
  });

  it('has a user reader method', function() {
    var user = ConfigReader.getUser();

    expect(user).toEqual(jasmine.any(Object));
    expect(user.userCode).toBe('ada-lovelace');
    expect(user.userName).toBe('Ada Lovelace');
    expect(user.email).toBe('ada.lovelace@computer.net');
    expect(user.roles).toContain('administrators');
  });

  it('can have a no access behavior property', function() {

    expect(ConfigReader.noAccessBehavior).toBe(NoAccessBehavior.throwError);
  });

  it('has a property for the path of locales', function() {

    expect(ConfigReader.pathOfLocales.substr(-8)).toBe(path.sep + 'locales');
  });

  it('has a locale reader method', function() {

    expect(ConfigReader.localeReader).toBe(getLocale);

    var locale = ConfigReader.localeReader();

    expect(locale).toBe('hu-HU');
  });
});
