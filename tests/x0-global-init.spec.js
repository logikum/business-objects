"use strict";

console.log('Initializing test repository for model tests...');

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
