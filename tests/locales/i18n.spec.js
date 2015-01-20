console.log('Testing locales/i18n.js...');

var i18n = require('../../source/locales/i18n.js');

describe('Internationalization', function () {
  var currentLocale = '';
  function getLocale () { return currentLocale; }
  var pathOfLocales = '/locales';
  i18n.initialize(pathOfLocales, getLocale);

  it('constructor expects 0-2 arguments', function () {
    var build01 = function () { return new i18n(); };
    var build02 = function () { return new i18n('project'); };
    var build03 = function () { return new i18n(undefined, 'type'); };
    var build04 = function () { return new i18n('project', null); };
    var build05 = function () { return new i18n(null, 'type'); };
    var build06 = function () { return new i18n('project', ''); };
    var build07 = function () { return new i18n('', 'type'); };
    var build08 = function () { return new i18n('project', 'type'); };
    var build09 = function () { return new i18n(1); };
    var build10 = function () { return new i18n(true); };
    var build11 = function () { return new i18n(new Date(2015, 1, 1)); };
    var build12 = function () { return new i18n([ 'project' ]); };

    expect(build01).not.toThrow();
    expect(build02).not.toThrow();
    expect(build03).not.toThrow();
    expect(build04).not.toThrow();
    expect(build05).not.toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
    expect(build09).toThrow();
    expect(build10).toThrow();
    expect(build11).toThrow();
    expect(build12).toThrow();
  });

  it('get method works', function() {
    var i1 = new i18n();
    var i2 = new i18n('$bo');
    var i3 = new i18n('dashboard');

    expect(
        i1.get('property1')
    ).toBe('value1');
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

  it('get method works with extended message keys', function() {
    var i1 = new i18n();
    var i2 = new i18n(null, 'capitols');

    expect(i1.get('capitols.France')).toBe('Paris');
    expect(i1.get('capitols.Egypt')).toBe('Cairo');
    expect(i1.get('capitols.Japan')).toBe('Tokyo');

    expect(i1.get('capitols.USA.Texas')).toBe('Austin');
    expect(i1.get('capitols.USA.North Dakota')).toBe('Bismarck');
    expect(i1.get('capitols.USA.Utah')).toBe('Salt Lake City');

    expect(i2.get('France')).toBe('Paris');
    expect(i2.get('Egypt')).toBe('Cairo');
    expect(i2.get('Japan')).toBe('Tokyo');

    expect(i2.get('USA.Texas')).toBe('Austin');
    expect(i2.get('USA.North Dakota')).toBe('Bismarck');
    expect(i2.get('USA.Utah')).toBe('Salt Lake City');
  });

  it('works with specific locale', function() {
    var i1 = new i18n();
    currentLocale = 'hu-HU';

    expect(i1.get('capitols.France')).toBe('Párizs');
    expect(i1.get('capitols.Egypt')).toBe('Kairó');
    expect(i1.get('capitols.Japan')).toBe('Tokió');

    expect(i1.getWithNs('dashboard', 'manager')).toBe('Kovács János');
    expect(i1.getWithNs('dashboard', 'developer')).toBe('Dolgos István');
    expect(i1.getWithNs('dashboard', 'designer')).toBe('Popper Mária');

    // Use missing locale.
    currentLocale = 'fr';

    expect(i1.get('capitols.France')).toBe('Paris');
    expect(i1.get('capitols.Egypt')).toBe('Cairo');
    expect(i1.get('capitols.Japan')).toBe('Tokyo');

    expect(i1.getWithNs('dashboard', 'manager')).toBe('John Smith');
    expect(i1.getWithNs('dashboard', 'developer')).toBe('Steve Jobs');
    expect(i1.getWithNs('dashboard', 'designer')).toBe('Mary Poppins');
  });
});
