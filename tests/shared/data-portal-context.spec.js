console.log('Testing shared/data-portal-context.js...');

var DataPortalContext = require('../../source/shared/data-portal-context.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var UserInfo = require('../../source/shared/user-info.js');
var UserReader = require('../../sample/get-user.js');

describe('Data portal context', function() {
  var dao = {};
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

  it('has six properties', function() {

    expect(ctx.dao).toBe(dao);
    expect(ctx.properties).toBe(properties);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
    expect(ctx.user).toEqual(jasmine.any(UserInfo));
    expect(ctx.locale).toBe('hu-HU');
  });

  it('has read-only properties', function() {
    ctx.dao = null;
    ctx.properties = null;
    ctx.connection = {};
    ctx.isSelfDirty = true;
    ctx.user = null;
    ctx.locale = '';

    expect(ctx.dao).toBe(dao);
    expect(ctx.properties).toBe(properties);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
    expect(ctx.user).not.toBeNull();
    expect(ctx.locale).toBe('hu-HU');
  });

  it('setState method works', function() {
    var connection = { connectionId: 1 };
    var result = ctx.setState(connection, true);

    expect(ctx.connection).toBe(connection);
    expect(ctx.isSelfDirty).toBe(true);

    var result = ctx.setState();

    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
  });

  it('getValue and setValue methods work', function() {
    var scores1 = ctx.getValue('scores');
    ctx.setValue('scores', -1);
    var scores2 = ctx.getValue('scores');

    expect(scores1).toBe(123);
    expect(scores2).toBe(-1);
  });
});
