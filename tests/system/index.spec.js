console.log('Testing system/index.js...');

var system = require('../../source/system/index.js');

var NotImplementedError = require('../../source/system/not-implemented-error.js');

describe('System component index', function () {
  var dao = {};
  var data = 0;
  function getValue () {
    return data;
  }
  function setValue (value) {
    data = value;
  }

  it('properties return correct components', function() {

    expect(new system.NotImplementedError('message')).toEqual(jasmine.any(NotImplementedError));
  });
});
