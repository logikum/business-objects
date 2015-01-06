console.log('Testing shared/enumeration.js...');

var numbers = require('./numbers.js');
var Enumeration = require('../../source/shared/enumeration.js');

describe('Enumeration', function() {
  var numbers1 = numbers.one;
  var numbers2 = numbers.two;
  var numbers3 = numbers.three;

  it('constructor expects one argument', function() {
    function build01() { var options = new Enumeration(); }
    function build02() { var options = new Enumeration(''); }
    function build03() { var options = new Enumeration('Options'); }
    function build04() { var options = new Enumeration(100); }
    function build05() { var options = new Enumeration(true); }
    function build06() { var options = new Enumeration({name:'Options'}); }
    function build07() { var options = new Enumeration(['Options']); }
    function build08() { var options = new Enumeration(new Date(2000, 12, 31)); }

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).not.toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).toThrow();
    expect(build07).toThrow();
    expect(build08).toThrow();
  });

  it('$name property returns the type name', function() {

    expect(numbers1.$name).toBe('Numbers1');
    expect(numbers2.$name).toBe('Numbers2');
    expect(numbers3.$name).toBe('Numbers3');
  });

  it('has the defined items', function() {

    expect(numbers3.one).toBe(0);
    expect(numbers3.two).toBe(1);
    expect(numbers3.three).toBe(2);
  });

  it('items are read-only', function() {
    numbers3.one = 100;
    numbers3.two = 200;
    numbers3.three = 300;

    expect(numbers3.one).toBe(0);
    expect(numbers3.two).toBe(1);
    expect(numbers3.three).toBe(2);
  });

  it('count method returns the item count', function() {

    expect(numbers1.count()).toBe(1);
    expect(numbers2.count()).toBe(2);
    expect(numbers3.count()).toBe(3);
  });

  it('getName method returns the item name', function() {

    function getName1() { var n = numbers3.getName(); }
    function getName2() { var n = numbers3.getName(-1); }
    function getName3() { var n = numbers3.getName(3); }

    expect(numbers3.getName(0)).toBe('one');
    expect(numbers3.getName(1)).toBe('two');
    expect(numbers3.getName(2)).toBe('three');

    expect(getName1).toThrow();
    expect(getName2).toThrow();
    expect(getName3).toThrow();
  });

  it('getValue method returns the item value', function() {

    function getValue1() { var n = numbers3.getName(); }
    function getValue2() { var n = numbers3.getName(''); }
    function getValue3() { var n = numbers3.getName('four'); }

    expect(numbers3.getValue('one')).toBe(0);
    expect(numbers3.getValue('two')).toBe(1);
    expect(numbers3.getValue('three')).toBe(2);

    expect(getValue1).toThrow();
    expect(getValue2).toThrow();
    expect(getValue3).toThrow();
  });

  it('check method inspects a value', function() {

    function check1() {numbers3.check(); }
    function check2() {numbers3.check(true); }
    function check3() {numbers3.check(''); }
    function check4() {numbers3.check(-1); }
    function check5() {numbers3.check(0); }
    function check6() {numbers3.check(2); }
    function check7() {numbers3.check(3); }
    function check8() {numbers3.check([0]); }

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

    function check1() {numbers3.check(10); }
    function check2() {numbers3.check(20, 'Invalid enumeration value!'); }

    expect(check1).toThrow('The passed value (10) is not a Numbers3 item.');
    expect(check2).toThrow('Invalid enumeration value!');
  });
});
