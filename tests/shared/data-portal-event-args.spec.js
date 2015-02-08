console.log('Testing shared/data-portal-event-args.js...');

var DataPortalEventArgs = require('../../source/shared/data-portal-event-args.js');
var DataPortalEvent = require('../../source/shared/data-portal-event.js');
var DataPortalAction = require('../../source/shared/data-portal-action.js');
var DataPortalError = require('../../source/shared/data-portal-error.js');
var UserInfo = require('../../source/system/user-info.js');

describe('Data portal event arguments', function () {
  var error = new DataPortalError('type', 'model', DataPortalAction.execute);

  it('constructor expects two-four arguments', function () {
    var build01 = function () {
      return new DataPortalEventArgs();
    };
    var build02 = function () {
      return new DataPortalEventArgs(DataPortalEvent.preCreate);
    };
    var build03 = function () {
      return new DataPortalEventArgs(DataPortalEvent.preCreate, 'model');
    };
    var build04 = function () {
      return new DataPortalEventArgs(DataPortalEvent.preSave, 'model');
    };
    var build05 = function () {
      return new DataPortalEventArgs(DataPortalEvent.preSave, 'model', DataPortalAction.remove);
    };
    var build06 = function () {
      return new DataPortalEventArgs(DataPortalEvent.postFetch, 'model', null, 'getByName');
    };
    var build07 = function () {
      return new DataPortalEventArgs(DataPortalEvent.postInsert, 'model', null, null, error);
    };
    var build08 = function () {
      return new DataPortalEventArgs(DataPortalEvent.postExecute, 'model', null, 'setState', error);
    };
    var build09 = function () {
      return new DataPortalEventArgs(DataPortalEvent.postSave, 'model', null, null, error);
    };
    var build10 = function () {
      return new DataPortalEventArgs(DataPortalEvent.postSave, 'model', DataPortalAction.update, null, error);
    };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).not.toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
    expect(build09).toThrow();
    expect(build10).not.toThrow();
  });

  it('has seven properties', function() {
    var dpea = new DataPortalEventArgs(
        DataPortalEvent.postExecute,
        'model',
        null,
        'setState',
        error
    );

    expect(dpea.eventName).toBe('postExecute');
    expect(dpea.modelName).toBe('model');
    expect(dpea.action).toBe(DataPortalAction.execute);
    expect(dpea.methodName).toBe('setState');
    expect(dpea.error).toBe(error);
    expect(dpea.user).toEqual(jasmine.any(UserInfo));
    expect(dpea.locale).toBe('hu-HU');
  });

  it('has read-only properties', function() {
    var dpea = new DataPortalEventArgs(
        DataPortalEvent.postExecute,
        'model',
        null,
        'setState',
        error
    );
    dpea.eventName = null;
    dpea.modelName = null;
    dpea.action = null;
    dpea.methodName = null;
    dpea.error = null;
    dpea.user = { userName: 'anonymous' };
    dpea.locale = null;

    expect(dpea.eventName).toBe('postExecute');
    expect(dpea.modelName).toBe('model');
    expect(dpea.action).toBe(DataPortalAction.execute);
    expect(dpea.methodName).toBe('setState');
    expect(dpea.error).toBe(error);
    expect(dpea.user.userName).toBe('Ada Lovelace');
    expect(dpea.locale).toBe('hu-HU');
  });
});
