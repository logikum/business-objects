console.log('Testing shared/config-reader.js...');

var path = require('path');
var ConfigReader = require('../../source/shared/config-reader.js');
var NoAccessBehavior = require('../../source/rules/no-access-behavior.js');
var daoBuilder = require('../../source/data-access/dao-builder.js');
var getUser = require('../../sample/get-user.js');
var getLocale = require('../../sample/get-locale.js');

describe('Business objects configuration reader object', function() {

  it('has a data access object builder method', function() {

    expect(ConfigReader.daoBuilder).toBe(daoBuilder);
  });

  it('has a user reader method', function() {
    expect(ConfigReader.userReader).toBe(getUser);

    var user = ConfigReader.userReader();

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
