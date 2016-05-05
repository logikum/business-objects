console.log('Testing shared/data-store.js...');

var DataStore = require('../../../source/shared/data-store.js');
var PropertyInfo = require('../../../source/shared/property-info.js');
var F = require('../../../source/shared/property-flag.js');
var Text = require('../../../source/data-types/text.js');
var ModelBase = require('../../../source/model-base.js');

describe('Data store', function () {

  it('constructor expects no argument', function () {
    var build01 = function () { return new DataStore(); };

    expect(build01).not.toThrow();
  });

  it('initValue method works', function() {
    var pm = new DataStore();
    var property = new PropertyInfo('name', new Text(), F.key);
    class TestModel extends ModelBase {
      constructor() {
        super();
        this.name = 'name';
        this.type = new Text();
        this.writable = true;
      }
    }
    var model = new TestModel();

    function initValue1() { pm.initValue(); }
    function initValue2() { pm.initValue(property); }
    function initValue3() { pm.initValue(property, null); }
    function initValue4() { pm.initValue(model, null); }
    function initValue5() { pm.initValue(property, model); }

    expect(initValue1).toThrow();
    expect(initValue2).not.toThrow();
    expect(initValue3).not.toThrow();
    expect(initValue4).toThrow();
    expect(initValue5).not.toThrow();
  });

  it('getValue method works', function() {
    var pm = new DataStore();
    var property = new PropertyInfo('name', new Text());
    var name = {
      name: 'name',
      type: new Text(),
      writable: true
    };
    pm.setValue(property, 'Ada Lovelace');

    function getValue1() { var v = pm.getValue(); }
    function getValue2() { var v = pm.getValue(6000); }
    function getValue3() { var v = pm.getValue('Ada Lovelace'); }
    function getValue4() { var v = pm.getValue(true); }
    function getValue5() { var v = pm.getValue(name); }

    expect(getValue1).toThrow();
    expect(getValue2).toThrow();
    expect(getValue3).toThrow();
    expect(getValue4).toThrow();
    expect(getValue5).toThrow();
    expect(pm.getValue(property)).toBe('Ada Lovelace');
  });

  it('setValue method works', function() {
    var pm = new DataStore('list');
    var property = new PropertyInfo('name', new Text());
    var name = {
      name: 'name',
      type: new Text(),
      writable: true
    };

    function setValue1() { pm.setValue(); }
    function setValue2() { pm.setValue(property); }
    function setValue3() { pm.setValue('Ada Lovelace'); }
    function setValue4() { pm.setValue(property, 6000); }
    function setValue5() { pm.setValue(name, 'Ada Lovelace'); }
    function setValue6() { pm.setValue(property, 'Ada Lovelace'); }

    expect(setValue1).toThrow();
    expect(setValue2).toThrow();
    expect(setValue3).toThrow();
    expect(setValue4).not.toThrow();
    expect(setValue5).toThrow();
    expect(setValue6).not.toThrow();
  });
});
