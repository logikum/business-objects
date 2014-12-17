console.log('Testing shared/transfer-context.js...');

var TransferContext = require('../../source/shared/transfer-context.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');

describe('Transfer context', function() {
  var pi = new PropertyInfo('property', new Text());
  function getValue () {
    return 1;
  }
  function setValue (value) {
    var x = setValue;
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

  it('has three properties', function() {

    expect(ctx.properties).toEqual(jasmine.any(Array));
    expect(ctx.getValue).toBe(getValue);
    expect(ctx.setValue).toBe(setValue);
  });

  it('has read-only properties', function() {
    ctx.properties = null;
    ctx.getValue = null;
    ctx.setValue = null;

    expect(ctx.properties).not.toBeNull();
    expect(ctx.getValue).not.toBeNull();
    expect(ctx.setValue).not.toBeNull();
  });
});
