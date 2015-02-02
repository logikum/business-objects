console.log('Testing shared/model-state.js...');

var ModelState = require('../../source/shared/model-state.js');

describe('Model state enumeration', function () {

  it('$name property returns the type name', function() {

    expect(ModelState.$name).toBe('ModelState');
  });

  it('has the defined items', function() {

    expect(ModelState.pristine).toBe(0);
    expect(ModelState.created).toBe(1);
    expect(ModelState.changed).toBe(2);
    expect(ModelState.markedForRemoval).toBe(3);
    expect(ModelState.removed).toBe(4);
  });

  it('count method returns the item count', function() {

    expect(ModelState.count()).toBe(5);
  });

  it('getName method returns the item name', function() {

    expect(ModelState.getName(0)).toBe('pristine');
    expect(ModelState.getName(1)).toBe('created');
    expect(ModelState.getName(2)).toBe('changed');
    expect(ModelState.getName(3)).toBe('markedForRemoval');
    expect(ModelState.getName(4)).toBe('removed');
  });

  it('getValue method returns the item value', function() {

    expect(ModelState.getValue('pristine')).toBe(0);
    expect(ModelState.getValue('created')).toBe(1);
    expect(ModelState.getValue('changed')).toBe(2);
    expect(ModelState.getValue('markedForRemoval')).toBe(3);
    expect(ModelState.getValue('removed')).toBe(4);
  });

  it('check method inspects a value', function() {

    function check1() {ModelState.check(-1); }
    function check2() {ModelState.check(ModelState.pristine); }
    function check3() {ModelState.check(ModelState.created); }
    function check4() {ModelState.check(ModelState.changed); }
    function check5() {ModelState.check(ModelState.markedForRemoval); }
    function check6() {ModelState.check(ModelState.removed); }
    function check7() {ModelState.check(5); }

    expect(check1).toThrow();
    expect(check2).not.toThrow();
    expect(check3).not.toThrow();
    expect(check4).not.toThrow();
    expect(check5).not.toThrow();
    expect(check6).not.toThrow();
    expect(check7).toThrow();
  });
});
