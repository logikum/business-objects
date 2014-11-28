console.log('Testing shared/property-info.js...');

var PropertyInfo = require('../../source/shared/property-info.js');
var DataType = require('../../source/data-types/data-type.js');
var Text = require('../../source/data-types/text.js');

describe('Property description', function() {
  function newType () {
    return {};
  }
  var pi = new PropertyInfo('property', new Text(), true);

  it('constructor expects two or three arguments', function() {
    function create1() { return new PropertyInfo(); }
    function create2() { return new PropertyInfo(null); }
    function create3() { return new PropertyInfo(1, 2); }
    function create4() { return new PropertyInfo('1', '2', '3'); }

    var pi1 = new PropertyInfo('property', newType);
    var pi2 = new PropertyInfo('property', new Text());
    var pi3 = new PropertyInfo('property', newType, false);
    var pi4 = new PropertyInfo('property', new Text(), true);

    expect(create1).toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();

    expect(pi1.name).toBe('property');
    expect(pi2.name).toBe('property');
    expect(pi3.name).toBe('property');
    expect(pi4.name).toBe('property');
  });

  it('has three properties', function() {

    expect(pi.name).toBe('property');
    expect(pi.type).toEqual(jasmine.any(DataType));
    expect(pi.readOnly).toBe(false);
  });

  it('has read-only properties', function() {
    pi.name = null;
    pi.type = null;
    pi.readOnly = null;

    expect(pi.name).not.toBeNull();
    expect(pi.type).not.toBeNull();
    expect(pi.readOnly).not.toBeNull();
  });
});
