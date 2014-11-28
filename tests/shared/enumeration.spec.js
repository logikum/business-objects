console.log('Testing shared/enumeration.js...');

var Enumeration = require('../../source/shared/enumeration.js');

describe('Enumeration', function() {
  var numbers = new Enumeration('one', 'two', 'three');

  it('constructor expects non-empty string arguments', function() {
    function create01() { return new Enumeration(); }
    function create02() { return new Enumeration(1987); }
    function create03() { return new Enumeration(true); }
    function create04() { return new Enumeration(new Date()); }
    function create05() { return new Enumeration({}); }
    function create06() { return new Enumeration(['one']); }
    function create07() { return new Enumeration('one', 'two', 'three', 4); }

    var numbers1 = new Enumeration('one');
    var numbers2 = new Enumeration('one', 'two');
    var numbers3 = new Enumeration('one', 'two', 'three');

    expect(create01).toThrow();
    expect(create02).toThrow();
    expect(create03).toThrow();
    expect(create04).toThrow();
    expect(create05).toThrow();
    expect(create06).toThrow();
    expect(create07).toThrow();

    expect(numbers1.count()).toBe(1);
    expect(numbers2.count()).toBe(2);
    expect(numbers3.count()).toBe(3);
  });

  it('has the defined items', function() {

    expect(numbers.one).toBe(0);
    expect(numbers.two).toBe(1);
    expect(numbers.three).toBe(2);
  });

  it('items are read-only', function() {
    numbers.one = 100;
    numbers.two = 200;
    numbers.three = 300;

    expect(numbers.one).toBe(0);
    expect(numbers.two).toBe(1);
    expect(numbers.three).toBe(2);
  });

  it('count method returns the item count', function() {

    expect(numbers.count()).toBe(3);
  });

  it('getName method returns the item name', function() {

    function getName1() { var n = numbers.getName(); }
    function getName2() { var n = numbers.getName(-1); }
    function getName3() { var n = numbers.getName(3); }

    expect(numbers.getName(0)).toBe('one');
    expect(numbers.getName(1)).toBe('two');
    expect(numbers.getName(2)).toBe('three');

    expect(getName1).toThrow();
    expect(getName2).toThrow();
    expect(getName3).toThrow();
  });

  it('getValue method returns the item value', function() {

    function getValue1() { var n = numbers.getName(); }
    function getValue2() { var n = numbers.getName(''); }
    function getValue3() { var n = numbers.getName('four'); }

    expect(numbers.getValue('one')).toBe(0);
    expect(numbers.getValue('two')).toBe(1);
    expect(numbers.getValue('three')).toBe(2);

    expect(getValue1).toThrow();
    expect(getValue2).toThrow();
    expect(getValue3).toThrow();
  });

  it('check method inspects a value', function() {

    function check1() {numbers.check(); }
    function check2() {numbers.check(true); }
    function check3() {numbers.check(''); }
    function check4() {numbers.check(-1); }
    function check5() {numbers.check(0); }
    function check6() {numbers.check(2); }
    function check7() {numbers.check(3); }
    function check8() {numbers.check([0]); }

    expect(check1).toThrow();
    expect(check2).toThrow();
    expect(check3).toThrow();
    expect(check4).toThrow();
    expect(check5).not.toThrow();
    expect(check6).not.toThrow();
    expect(check7).toThrow();
    expect(check8).toThrow();
  });

  it('check method sets error message', function() {

    function check1() {numbers.check(10); }
    function check2() {numbers.check(20, 'Invalid enumeration value!'); }

    expect(check1).toThrow('The passed value is not an enumeration item.');
    expect(check2).toThrow('Invalid enumeration value!');
  });
});
