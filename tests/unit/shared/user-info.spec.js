console.log('Testing shared/user-info.js...');

var UserInfo = require('../../../source/system/user-info.js');

describe('User base type', function() {
  var user = new UserInfo('anonymous');

  it('constructor expects an optional string argument', function() {
    function create1() { return new UserInfo(123456789); }
    function create2() { return new UserInfo(new Date()); }
    function create3() { return new UserInfo({}); }
    function create4() { return new UserInfo(['anonymous']); }

    var user1 = new UserInfo();
    var user2 = new UserInfo(null);
    var user3 = new UserInfo('');
    var user4 = new UserInfo('anonymous');

    expect(create1).toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();

    expect(user1.userCode).toBeNull();
    expect(user2.userCode).toBeNull();
    expect(user3.userCode).toBe('');
    expect(user4.userCode).toBe('anonymous');
  });

  it('has one property', function() {

    expect(user.userCode).toBe('anonymous');
  });

  it('has one not implemented methods', function() {
    function call1() { user.isInRole('developers'); }

    expect(user.isInRole).toBeDefined();

    expect(call1).toThrow();
  });
});
