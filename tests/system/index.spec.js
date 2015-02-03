console.log('Testing system/index.js...');

var system = require('../../source/system/index.js');

var ArgumentError = require('../../source/system/argument-error.js');
var EnumerationError = require('../../source/system/enumeration-error.js');
var NotImplementedError = require('../../source/system/not-implemented-error.js');
//var Utility = require('../../source/system/utility.js');

describe('System component index', function () {

  it('properties return correct components', function() {

    expect(new system.ArgumentError('message')).toEqual(jasmine.any(ArgumentError));
    expect(new system.EnumerationError('message')).toEqual(jasmine.any(EnumerationError));
    expect(new system.NotImplementedError('message')).toEqual(jasmine.any(NotImplementedError));
    expect(system.Utility).toEqual(jasmine.any(Function));
  });
});
