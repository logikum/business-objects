console.log('Testing shared/i18n.js...');

var i18n = require('../../source/shared/i18n.js');

describe('Internationalization', function () {

  it('constructor expects none or one argument', function () {
    var build01 = function () { return new i18n(); };
    var build02 = function () { return new i18n('project'); };
    var build03 = function () { return new i18n(1); };
    var build04 = function () { return new i18n(true); };
    var build05 = function () { return new i18n(new Date(2015, 1, 1)); };
    var build06 = function () { return new i18n([ 'project' ]); };

    expect(build01).not.toThrow();
    expect(build02).not.toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
  });

  it('get method works', function() {
    var i1 = new i18n();
    var i2 = new i18n('$bo');
    var i3 = new i18n('dashboard');

    expect(i1.get('property1')).toBe('value1');
    expect(i1.get('-invalid-key-')).toBe('-invalid-key-');

    expect(i2.get('default')).toBe('This is a test message.');
    expect(i2.get('-invalid-key-')).toBe('-invalid-key-');

    expect(i3.get('manager')).toBe('John Smith');
    expect(i3.get('-invalid-key-')).toBe('-invalid-key-');
  });

  it('getWithNs method works', function() {
    var i1 = new i18n();
    var i2 = new i18n('$bo');
    var i3 = new i18n('dashboard');

    expect(i1.getWithNs('$default', 'property1')).toBe('value1');
    expect(i1.getWithNs('$default', '-invalid-key-')).toBe('-invalid-key-');
    expect(i1.getWithNs('$bo', 'default')).toBe('This is a test message.');
    expect(i1.getWithNs('dashboard', 'developer')).toBe('Steve Jobs');

    expect(i2.getWithNs('$bo', 'default')).toBe('This is a test message.');
    expect(i2.getWithNs('$bo', '-invalid-key-')).toBe('-invalid-key-');
    expect(i2.getWithNs('$default', 'property2')).toBe('value2');
    expect(i2.getWithNs('dashboard', 'designer')).toBe('Mary Poppins');

    expect(i3.getWithNs('dashboard', 'manager')).toBe('John Smith');
    expect(i3.getWithNs('dashboard', '-invalid-key-')).toBe('-invalid-key-');
    expect(i3.getWithNs('$default', 'property3')).toBe('value3');
    expect(i3.getWithNs('$bo', 'default')).toBe('This is a test message.');
  });


  it('parameter replacement works', function() {
    var i1 = new i18n();

    expect(i1.get('template1', 'world')).toBe('Hello, world!');
    expect(i1.get('template2', 'Albert Einstein', 'scientist')).toBe('Albert Einstein is a famous scientist.');
    expect(i1.get('template3', 3, 7, 21)).toBe('Result: 3 * 7 = 21');
  });
});
