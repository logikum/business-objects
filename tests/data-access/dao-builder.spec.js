console.log('Testing data-access/dao-builder.js...');

var path = require('path');
var DaoBuilder = require('../../source/data-access/dao-builder.js');
var DaoBase = require('../../source/data-access/dao-base.js');

describe('Data access object builder', function () {

  it('is a function', function () {

    expect(typeof DaoBuilder === 'function').toBe(true);
  });

  it('works', function () {
    var p = path.join(__dirname, '../../sample/widget.js');
    var dao = DaoBuilder('dao', p, 'Horus');

    expect(dao).toEqual(jasmine.any(DaoBase));
    expect(dao.name).toBe('WidgetDao');
    expect(dao.select()).toBe('Hello, world!');
  });
});
