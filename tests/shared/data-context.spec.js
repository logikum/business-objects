console.log('Testing shared/data-context.js...');

var DataContext = require('../../source/shared/data-context.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var UserInfo = require('../../source/shared/user-info.js');
var UserReader = require('../../sample/get-user.js');

describe('Data context', function() {
  var dao = {};
  var user = UserReader();
  var properties = [ new PropertyInfo('scores', new Text()) ];
  var data = { scores: 123 };
  function getValue (property) {
    return data[property.name];
  }
  function setValue (property, value) {
    data[property.name] = value;
  }
  var ctx = new DataContext(dao, user, properties, getValue, setValue);

  it('constructor expects zero-five arguments', function() {
    function create01() { return new DataContext(); }
    function create02() { return new DataContext(1, 2); }
    function create03() { return new DataContext('1', '2', '3', '4', '5'); }
    function create04() { return new DataContext(dao); }
    function create05() { return new DataContext(dao, user); }
    function create06() { return new DataContext(dao, user, []); }
    function create07() { return new DataContext(dao, user, properties); }
    function create08() { return new DataContext(dao, user, properties, getValue); }
    function create09() { return new DataContext(dao, user, properties, getValue, setValue); }
    function create10() { return new DataContext(dao, {}, properties, getValue, setValue); }

    expect(create01).not.toThrow();
    expect(create02).toThrow();
    expect(create03).toThrow();
    expect(create04).not.toThrow();
    expect(create05).not.toThrow();
    expect(create06).not.toThrow();
    expect(create07).not.toThrow();
    expect(create08).not.toThrow();
    expect(create09).not.toThrow();
    expect(create10).toThrow();
  });

  it('has five properties', function() {

    expect(ctx.dao).toBe(dao);
    expect(ctx.user).toEqual(jasmine.any(UserInfo));
    expect(ctx.properties).toBe(properties);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
  });

  it('has read-only properties', function() {
    ctx.dao = null;
    ctx.user = null;
    ctx.properties = null;
    ctx.connection = {};
    ctx.isSelfDirty = true;

    expect(ctx.dao).toBe(dao);
    expect(ctx.user).toBe(user);
    expect(ctx.properties).toBe(properties);
    expect(ctx.connection).toBeNull();
    expect(ctx.isSelfDirty).toBe(false);
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
