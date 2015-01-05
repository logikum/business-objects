console.log('Testing shared/data-context.js...');

var DataContext = require('../../source/shared/data-context.js');
var UserInfo = require('../../source/shared/user-info.js');
var UserReader = require('../../sample/get-user.js');

describe('Data context', function() {
  var dao = {};
  var user = UserReader();
  var properties = [ { name: 'scores' } ];
  var data = { scores: 123 };
  function getValue (property) {
    return data[property.name];
  }
  function setValue (property, value) {
    data[property.name] = value;
  }
  var ctx = new DataContext(dao, user, false, properties, getValue, setValue);

  it('constructor expects zero-six arguments', function() {
    function create01() { return new DataContext(); }
    function create02() { return new DataContext(1, 2); }
    function create03() { return new DataContext('1', '2', '3', '4', '5', '6'); }
    function create04() { return new DataContext(dao); }
    function create05() { return new DataContext(dao, user); }
    function create06() { return new DataContext(dao, user, false); }
    function create07() { return new DataContext(dao, user, true, properties); }
    function create08() { return new DataContext(dao, user, false, properties, getValue); }
    function create09() { return new DataContext(dao, user, true, properties, getValue, setValue); }
    function create10() { return new DataContext(dao, {}, false, properties, getValue, setValue); }

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

  it('has four properties', function() {

    expect(ctx.dao).toBe(dao);
    expect(ctx.user).toEqual(jasmine.any(UserInfo));
    expect(ctx.isSelfDirty).toBe(false);
    expect(ctx.properties).toBe(properties);
  });

  it('has read-only properties', function() {
    ctx.dao = null;
    ctx.user = null;
    ctx.isSelfDirty = true;
    ctx.properties = null;

    expect(ctx.dao).toBe(dao);
    expect(ctx.user).toBe(user);
    expect(ctx.isSelfDirty).toBe(false);
    expect(ctx.properties).toBe(properties);
  });

  it('setSelfDirty method works', function() {
    var result = ctx.setSelfDirty(true);

    expect(result).toBe(ctx);
    expect(result.isSelfDirty).toBe(true);
  });

  it('getValue and setValue methods work', function() {
    var scores1 = ctx.getValue('scores');
    ctx.setValue('scores', -1);
    var scores2 = ctx.getValue('scores');

    expect(scores1).toBe(123);
    expect(scores2).toBe(-1);
  });
});
