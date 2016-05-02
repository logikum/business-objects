console.log('Testing shared/data-portal-context.js...');

var DataPortalContext = require('../../../source/shared/data-portal-context.js');
var PropertyInfo = require('../../../source/shared/property-info.js');
var Text = require('../../../source/data-types/text.js');
var UserInfo = require('../../../source/system/user-info.js');
var UserReader = require('../../../data/get-user.js');

describe('Data portal context', function() {
  var dao = {
    $runMethod: function( methodName, connection, methodArg ) {
      return methodName + ' * ' +
          (connection ? connection.toString() : 'NO connection') + ' * ' +
          (methodArg ? methodArg.toString() : 'NO argument');
    }
  };
  //var user = UserReader();
  var properties = [ new PropertyInfo('scores', new Text()) ];
  var data = { scores: 123 };
  function getValue (property) {
    return data[property.name];
  }
  function setValue (property, value) {
    data[property.name] = value;
  }
  var ctx = new DataPortalContext(dao, properties, getValue, setValue);

  it('constructor expects zero-five arguments', function() {
    function create01() { return new DataPortalContext(); }
    function create02() { return new DataPortalContext(1, 2); }
    function create03() { return new DataPortalContext('1', '2', '3', '4', '5'); }
    function create04() { return new DataPortalContext(dao); }
    function create05() { return new DataPortalContext(dao, []); }
    function create06() { return new DataPortalContext(dao, properties); }
    function create07() { return new DataPortalContext(dao, properties, getValue); }
    function create08() { return new DataPortalContext(dao, properties, getValue, setValue); }

    expect(create01).not.toThrow();
    expect(create02).toThrow();
    expect(create03).toThrow();
    expect(create04).not.toThrow();
    expect(create05).not.toThrow();
    expect(create06).not.toThrow();
    expect(create07).not.toThrow();
    expect(create08).not.toThrow();
  });

  it('has eight properties', function() {

    expect(ctx.dao).toBe(dao);
    expect(ctx.properties).toBe(properties);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
    expect(ctx.user).toEqual(jasmine.any(UserInfo));
    expect(ctx.locale).toBe('hu-HU');
    expect(ctx.fulfill).toBeNull();
    expect(ctx.reject).toBeNull();
  });

  it('has read-only properties', function() {
    ctx.dao = null;
    ctx.properties = null;
    ctx.connection = {};
    ctx.isSelfDirty = true;
    ctx.user = null;
    ctx.locale = '';
    ctx.fulfill = function() {};
    ctx.reject = function() {};

    expect(ctx.dao).toBe(dao);
    expect(ctx.properties).toBe(properties);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
    expect(ctx.user).not.toBeNull();
    expect(ctx.locale).toBe('hu-HU');
    expect(ctx.fulfill).toBeNull();
    expect(ctx.reject).toBeNull();
  });

  it('setState method works', function() {
    var connection = { connectionId: 1 };
    var result1 = ctx.setState(connection, true);

    expect(result1).toBe(ctx);
    expect(ctx.connection).toBe(connection);
    expect(ctx.isSelfDirty).toBe(true);

    var result2 = ctx.setState();

    expect(result2).toBe(ctx);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
  });

  it('setPromise method works', function() {
    function fulfill( value ) {
      return value;
    }
    function reject( reason ) {
      return reason;
    }
    ctx.setPromise( fulfill, reject );

    expect(ctx.fulfill).toBe(fulfill);
    expect(ctx.reject).toBe(reject);
    expect(ctx.fulfill('Success!')).toBe('Success!');
    expect(ctx.reject('Failure!')).toBe('Failure!');
  });

  it('getValue and setValue methods work', function() {
    var scores1 = ctx.getValue('scores');
    ctx.setValue('scores', -1);
    var scores2 = ctx.getValue('scores');

    expect(scores1).toBe(123);
    expect(scores2).toBe(-1);
  });

  it('call DAO methods work', function() {

    expect(ctx.call('call', 4096)).toBe('call * NO connection * 4096');
    expect(ctx.create()).toBe('create * NO connection * NO argument');
    expect(ctx.fetch(4096)).toBe('fetch * NO connection * 4096');
    expect(ctx.insert(4096)).toBe('insert * NO connection * 4096');
    expect(ctx.update(4096)).toBe('update * NO connection * 4096');
    expect(ctx.remove(4096)).toBe('remove * NO connection * 4096');
    expect(ctx.execute(4096)).toBe('execute * NO connection * 4096');
  });
});
