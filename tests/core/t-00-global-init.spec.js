console.log('Initializing test environment for cor model tests...');

var configuration = require('../../source/shared/configuration-reader.js');
//var i18n = require('../../source/locales/i18n.js');

configuration.initialize('/config/business-objects.js');
//i18n.initialize(configuration.pathOfLocales, configuration.getLocale);

describe('Test repository', function () {

  it('initialization', function () {

    global.orderKey = 0;
    global.orders = {};

    global.addressKey = 0;
    global.addresses = {};

    global.itemKey = 0;
    global.items = {};

    global.scheduleKey = 0;
    global.schedules = {};

    expect(true).toBe(true);
  });
});
