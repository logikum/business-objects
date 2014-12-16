console.log('Testing shared/property-manager.js...');

var PropertyManager = require('../../source/shared/property-manager.js');
var PropertyInfo = require('../../source/shared/property-info.js');
var F = require('../../source/shared/property-flag.js');
var Text = require('../../source/data-types/text.js');
var util = require('util');
var ModelBase = require('../../source/model-base.js');

describe('Property manager', function () {

  it('constructor expects a non-empty string and optional properties', function() {
    var property = new PropertyInfo('name', new Text(), F.key);

    function create1() { return new PropertyManager(); }
    function create2() { return new PropertyManager(null); }
    function create3() { return new PropertyManager(1, 2); }
    function create4() { return new PropertyManager('list', 1024); }
    function create5() { return new PropertyManager('list', property, false); }
    function create6() { return new PropertyManager('', property); }

    var pm1 = new PropertyManager('list');
    var pm2 = new PropertyManager('list', property);

    expect(create1).toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();
    expect(create5).toThrow();
    expect(create6).toThrow();

    expect(pm1.name).toBe('list');
    expect(pm2.name).toBe('list');
  });

  it('has read-only name property', function() {
    var pm = new PropertyManager('list');
    pm.name = null;

    expect(pm.name).toBe('list');
  });

  //region Item management

  it('add method works', function() {
    var pm = new PropertyManager('list');

    function add1() {
      var email = {
        name: 'email',
        type: new Text(),
        writable: true
      };
      pm.add(email);
    }
    function add2() {
      var email = new PropertyInfo('email', new Text(), F.readOnly);
      pm.add(email);
    }

    expect(add1).toThrow();
    expect(add2).not.toThrow();
  });

  it('create method works', function() {
    var pm = new PropertyManager('list');
    var property = pm.create('name', new Text(), 0);

    expect(property).toEqual(jasmine.any(PropertyInfo));
  });

  it('contains method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key | F.notOnCto);
    var propertyEmail = new PropertyInfo('email', new Text());
    var pm = new PropertyManager('list', propertyName);

    function contains1() {
      var email = {
        name: 'email',
        type: new Text(),
        writable: true
      };
      var exists = pm.contains(email);
    }

    expect(contains1).toThrow();
    expect(pm.contains(propertyEmail)).toBe(false);
    expect(pm.contains(propertyName)).toBe(true);
  });

  it('getByName method works', function() {
    var pm = new PropertyManager('list');
    var property = pm.create('name', new Text());

    function getByName1() { var p = pm.getByName(); }
    function getByName2() { var p = pm.getByName(null); }
    function getByName3() { var p = pm.getByName(1); }
    function getByName4() { var p = pm.getByName(''); }
    function getByName5() { var p = pm.getByName('email'); }
    function getByName6() { var p = pm.getByName('email', 'Ooops!'); }

    var result = pm.getByName('name');

    expect(getByName1).toThrow();
    expect(getByName2).toThrow();
    expect(getByName3).toThrow();
    expect(getByName4).toThrow();
    expect(getByName5).toThrow();
    expect(getByName6).toThrow('Ooops!');
    expect(result).toBe(property);
  });

  it('forEach method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key);
    var propertyEmail = new PropertyInfo('email', new Text(), F.readOnly);
    var pm = new PropertyManager('list', propertyName, propertyEmail);
    var count = 0;
    var names = '';

    pm.forEach(function (item) {
      names += names === '' ? item.name : ', ' + item.name;
      count++;
    });

    expect(count).toBe(2);
    expect(names).toBe('name, email');
  });

  //endregion

  //region Value handling

  it('initValue method works', function() {
    var pm = new PropertyManager('list');
    var property = pm.create('name', new Text(), F.key);
    var model = {
      name: 'name',
      type: new Text(),
      writable: true
    };
    util.inherits(model, ModelBase);

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

  it('setValue method works', function() {
    var pm = new PropertyManager('list');
    var property = pm.create('name', new Text());
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
    expect(setValue4).toThrow();
    expect(setValue5).toThrow();
    expect(setValue6).not.toThrow();
  });

  it('getValue method works', function() {
    var pm = new PropertyManager('list');
    var property = pm.create('name', new Text());
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

  //endregion
});
