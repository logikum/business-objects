console.log('Testing locales/config-reader.js...');

var path = require('path');
var ConfigReader = require('../../source/locales/config-reader.js');

describe('Localization configuration reader object', function() {

  it('has a locale reader method', function() {
    var locale = ConfigReader.localeReader();

    expect(ConfigReader.localeReader).toBeDefined();

    expect(locale).toBe('hu-HU');
  });

  it('has a property for the path of locales', function() {

    expect(ConfigReader.pathOfLocales.substr(-8)).toBe(path.sep + 'locales');
  });
});
