console.log('Testing data-access/dao-base.js...');

var DaoBase = require('../../source/data-access/dao-base.js');

describe('Base data access object', function () {

  it('constructor expects one argument', function () {
    var build01 = function () { return new DaoBase(); };
    var build02 = function () { return new DaoBase(123.56); };
    var build03 = function () { return new DaoBase(false); };
    var build04 = function () { return new DaoBase(new Date(2014, 12, 12)); };
    var build05 = function () { return new DaoBase({ name: 'Africa' }); };
    var build06 = function () { return new DaoBase([ 'name' ]); };
    var build07 = function () { return new DaoBase(''); };
    var build08 = function () { return new DaoBase('name'); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).not.toThrow();
  });

  it('has one property', function() {
    var dao = new DaoBase('Darts');

    expect(dao.name).toBe('Darts');
  });

  it('checkMethod method work', function() {
    var dao = new DaoBase('Sample');
    dao.select = function () {};
    dao.count = 51;

    var check01 = function () { dao.checkMethod(); };
    var check02 = function () { dao.checkMethod(51); };
    var check03 = function () { dao.checkMethod(''); };
    var check04 = function () { dao.checkMethod('create'); };
    var check05 = function () { dao.checkMethod('select'); };
    var check06 = function () { dao.checkMethod('count'); };

    expect(check01).toThrow();
    expect(check02).toThrow();
    expect(check03).toThrow();
    expect(check04).toThrow();
    expect(check05).not.toThrow();
    expect(check06).toThrow();
  });
});
