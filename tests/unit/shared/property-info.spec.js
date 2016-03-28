console.log('Testing shared/property-info.js...');

var PropertyInfo = require('../../../source/shared/property-info.js');
var F = require('../../../source/shared/property-flag.js');
var DataType = require('../../../source/data-types/data-type.js');
var Text = require('../../../source/data-types/text.js');
var CollectionBase = require('../../../source/collection-base.js');

describe('Property description', function() {
  var items = new CollectionBase();
  var pi = new PropertyInfo('property', new Text());

  it('constructor expects two or three arguments', function() {
    function create1() { return new PropertyInfo(); }
    function create2() { return new PropertyInfo(null); }
    function create3() { return new PropertyInfo(1, 2); }
    function create4() { return new PropertyInfo('1', '2', '3'); }

    var pi1 = new PropertyInfo('property', items);
    var pi2 = new PropertyInfo('property', new Text());
    var pi3 = new PropertyInfo('property', items, F.readOnly);
    var pi4 = new PropertyInfo('property', new Text(), F.key | F.onDtoOnly);

    expect(create1).toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();

    expect(pi1.name).toBe('property');
    expect(pi2.name).toBe('property');
    expect(pi3.name).toBe('property');
    expect(pi4.name).toBe('property');
  });

  it('has seven properties', function() {

    expect(pi.name).toBe('property');
    expect(pi.type).toEqual(jasmine.any(DataType));
    expect(pi.isReadOnly).toBe(false);
    expect(pi.isKey).toBe(false);
    expect(pi.isParentKey).toBe(false);
    expect(pi.isOnDto).toBe(true);
    expect(pi.isOnCto).toBe(true);
  });

  it('has read-only properties', function() {
    pi.name = null;
    pi.type = null;
    pi.isReadOnly = true;
    pi.isKey = true;
    pi.isParentKey = true;
    pi.isOnDto = false;
    pi.isOnCto = false;

    expect(pi.name).not.toBeNull();
    expect(pi.type).not.toBeNull();
    expect(pi.isReadOnly).toBe(false);
    expect(pi.isKey).toBe(false);
    expect(pi.isParentKey).toBe(false);
    expect(pi.isOnDto).toBe(true);
    expect(pi.isOnCto).toBe(true);
  });

  it('hasValue method works', function() {
    expect(pi.hasValue(null)).toBe(false);
    expect(pi.hasValue(undefined)).toBe(false);
    expect(pi.hasValue('')).toBe(false);
    expect(pi.hasValue('hasValue')).toBe(true);
  });
});
