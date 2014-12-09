console.log('Testing data-access/dao-builder.js...');

var DaoBuilder = require('../../source/data-access/dao-builder.js');

describe('Data access object builder', function () {

  it('is a function', function () {

    expect(typeof DaoBuilder === 'function').toBe(true);
  });
});
