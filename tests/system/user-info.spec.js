console.log('Testing system/enumeration.js...');

//var util = require('util');
var UserInfo = require('../../source/system/user-info.js');

describe('User info', function() {

  it('constructor expects one optional string argument', function() {
    function build01() { var user = new UserInfo(false); }
    function build02() { var user = new UserInfo(1); }
    function build03() { var user = new UserInfo({}); }
    function build04() { var user = new UserInfo([]); }
    function build05() { var user = new UserInfo(function() {}); }
    function build06() { var user = new UserInfo(new Date()); }
    function build07() { var user = new UserInfo(new RegExp('[0-9]+')); }

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();

    var user1 = new UserInfo();
    var user2 = new UserInfo(null);
    var user3 = new UserInfo('');
    var user4 = new UserInfo('Oriza Triznyák');

    expect(user1.userCode).toBe(null);
    expect(user2.userCode).toBe(null);
    expect(user3.userCode).toBe('');
    expect(user4.userCode).toBe('Oriza Triznyák');
  });

  it('has one property', function() {
    var user = new UserInfo();
    user.userCode = 'Mirr-Murr';

    expect(user.userCode).toBe('Mirr-Murr');
  });

  it('has one not implemented method', function() {
    var user = new UserInfo('Csizmás kandúr');

    function use01() { var hasPermission = user.isInRole('drivers'); }

    expect(use01).toThrow('The UserInfo.isInRole method is not implemented.');
  });
});
