console.log('Testing shared/config-reader.js...');

var ConfigReader = require('../../source/shared/config-reader.js');
var NoAccessBehavior = require('../../source/rules/no-access-behavior.js');

describe('Configuration reader object', function() {

  it('has a data access object builder method', function() {

    expect(ConfigReader.daoBuilder).toBeDefined();
  });

  it('has a user reader method', function() {
    var user = ConfigReader.userReader();

    expect(ConfigReader.userReader).toBeDefined();
    expect(ConfigReader.userReader).not.toThrow();

    expect(user).toEqual(jasmine.any(Object));
    expect(user.userCode).toBe('marmarosi');
    expect(user.userName).toBe('Mármarosi József');
    expect(user.email).toBe('marmarosi@logikum.hu');
    expect(user.roles).toContain('administrators');
  });

  it('can have a no access behavior property', function() {

    expect(ConfigReader.noAccessBehavior).toBe(NoAccessBehavior.throwError);
  });
});
