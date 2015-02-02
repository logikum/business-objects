console.log('Testing shared/data-portal-event-args.js...');

var DataPortalEventArgs = require('../../source/shared/data-portal-event-args.js');
var DataPortalAction = require('../../source/shared/data-portal-action.js');
var DataPortalError = require('../../source/shared/data-portal-error.js');
var UserInfo = require('../../source/shared/user-info.js');

describe('Data portal event arguments', function () {
  var error = new DataPortalError('type', 'model', DataPortalAction.execute);

  it('constructor expects two-four arguments', function () {
    var build1 = function () {
      return new DataPortalEventArgs();
    };
    var build2 = function () {
      return new DataPortalEventArgs('model');
    };
    var build3 = function () {
      return new DataPortalEventArgs('model', DataPortalAction.execute);
    };
    var build4 = function () {
      return new DataPortalEventArgs('model', DataPortalAction.execute, 'execute');
    };
    var build5 = function () {
      return new DataPortalEventArgs('model', DataPortalAction.execute, 'execute', error);
    };
    var build6 = function () {
      return new DataPortalEventArgs('model', DataPortalAction.execute, null, error);
    };

    expect(build1).toThrow();
    expect(build2).toThrow();
    expect(build3).not.toThrow();
    expect(build4).not.toThrow();
    expect(build5).not.toThrow();
    expect(build6).not.toThrow();
  });

  it('has six properties', function() {
    var dpea = new DataPortalEventArgs('model', DataPortalAction.execute, null, error);

    expect(dpea.modelName).toBe('model');
    expect(dpea.action).toBe(DataPortalAction.execute);
    expect(dpea.methodName).toBe('execute');
    expect(dpea.error).toBe(error);
    expect(dpea.user).toEqual(jasmine.any(UserInfo));
    expect(dpea.locale).toBe('hu-HU');
  });

  it('has read-only properties', function() {
    var dpea = new DataPortalEventArgs('model', DataPortalAction.execute, null, error);
    dpea.modelName = null;
    dpea.action = null;
    dpea.methodName = null;
    dpea.error = null;
    dpea.user = { userName: 'anonymous' };
    dpea.locale = null;

    expect(dpea.modelName).toBe('model');
    expect(dpea.action).toBe(DataPortalAction.execute);
    expect(dpea.methodName).toBe('execute');
    expect(dpea.error).toBe(error);
    expect(dpea.user.userName).toBe('Ada Lovelace');
    expect(dpea.locale).toBe('hu-HU');
  });
});
