console.log('Testing shared/data-context.js...');

var DataContext = require('../../source/shared/data-context.js');
var UserInfo = require('../../source/shared/user-info.js');
var UserReader = require('../../sample/user-reader.js');

xdescribe('Data context', function() {
  var dao = {};
  var user = UserReader();
  function toDto () {
    return {};
  }
  function fromDto (dto) {
    this.name = dto.name;
  }
  var ctx = new DataContext(dao, user, true, toDto, fromDto);

  it('constructor expects five arguments', function() {
    function create1() { return new DataContext(); }
    function create2() { return new DataContext(1, 2, 3, 4, 5); }
    function create3() { return new DataContext('1', '2', '3', '4', '5'); }
    function create4() { return new DataContext(dao); }
    function create5() { return new DataContext(dao, user); }
    function create6() { return new DataContext(dao, user, false); }
    function create7() { return new DataContext(dao, user, true, toDto); }
    function create8() { return new DataContext(dao, {}, false, toDto, fromDto); }
    function create9() { return new DataContext(dao, user, true, toDto, fromDto); }

    expect(create1).toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();
    expect(create5).toThrow();
    expect(create6).toThrow();
    expect(create7).toThrow();
    expect(create8).toThrow();
    expect(create9).not.toThrow();
  });

  it('has five properties', function() {

    expect(ctx.dao).toBe(dao);
    expect(ctx.user).toEqual(jasmine.any(UserInfo));
    expect(ctx.isSelfDirty).toBe(true);
    expect(ctx.toDto).toBe(toDto);
    expect(ctx.fromDto).toBe(fromDto);
  });

  it('has read-only properties', function() {
    ctx.dao = null;
    ctx.user = null;
    ctx.isSelfDirty = null;
    ctx.toDto = null;
    ctx.fromDto = null;

    expect(ctx.dao).not.toBeNull();
    expect(ctx.user).not.toBeNull();
    expect(ctx.isSelfDirty).not.toBeNull();
    expect(ctx.toDto).not.toBeNull();
    expect(ctx.fromDto).not.toBeNull();
  });
});
