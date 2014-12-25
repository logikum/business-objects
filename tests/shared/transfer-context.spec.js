console.log('Testing shared/transfer-context.js...');

var TransferContext = require('../../source/shared/transfer-context.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');

describe('Transfer context', function() {
  var pi = new PropertyInfo('property', new Text());
  var propertyValue = 125;
  function getValue (property) {
    return property.name === 'property' ? propertyValue : null;
  }
  function setValue (property, value) {
    propertyValue = property.name === 'property' ? value : null;
  }
  var ctx = new TransferContext([ pi ], getValue, setValue);

  it('constructor expects three arguments', function() {
    function create1() { return new TransferContext(); }
    function create2() { return new TransferContext(1, 2, 3); }
    function create3() { return new TransferContext('1', '2', '3'); }
    function create4() { return new TransferContext([ pi ]); }
    function create5() { return new TransferContext([ pi ], getValue); }
    function create6() { return new TransferContext([ pi ], getValue, setValue); }
    function create7() { return new TransferContext([ pi ], getValue, {}); }
    function create8() { return new TransferContext([ pi ], {}, setValue); }

    expect(create1).toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();
    expect(create5).toThrow();
    expect(create6).not.toThrow();
    expect(create7).toThrow();
    expect(create8).toThrow();
  });

  it('has one property', function() {

    expect(ctx.properties).toEqual(jasmine.any(Array));
  });

  it('has a read-only property', function() {
    ctx.properties = null;
    ctx.getValue = null;
    ctx.setValue = null;

    expect(ctx.properties).not.toBeNull();
  });

  it('getValue method works', function() {

    expect(ctx.getValue('property')).toBe(125);
  });

  it('setValue method works', function() {
    ctx.setValue('property', 216);

    expect(ctx.getValue('property')).toBe(216);
  });
});
