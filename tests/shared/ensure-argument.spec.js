console.log('Testing shared/ensure-argument.js...');

var numbers = require('./numbers.js');
var ensureArgument = require('../../source/shared/ensure-argument.js');

describe('Argument checking object', function () {

  it('has the necessary methods', function () {
    // Generic
    expect(ensureArgument.hasValue).toBeDefined();
    // String
    expect(ensureArgument.isString).toBeDefined();
    expect(ensureArgument.isOptionalString).toBeDefined();
    expect(ensureArgument.isMandatoryString).toBeDefined();
    // Number
    expect(ensureArgument.isOptionalNumber).toBeDefined();
    expect(ensureArgument.isMandatoryNumber).toBeDefined();
    // Integer
    expect(ensureArgument.isOptionalInteger).toBeDefined();
    expect(ensureArgument.isMandatoryInteger).toBeDefined();
    // Boolean
    expect(ensureArgument.isOptionalBoolean).toBeDefined();
    expect(ensureArgument.isMandatoryBoolean).toBeDefined();
    // Object
    expect(ensureArgument.isOptionalObject).toBeDefined();
    expect(ensureArgument.isMandatoryObject).toBeDefined();
    // Function
    expect(ensureArgument.isOptionalFunction).toBeDefined();
    expect(ensureArgument.isMandatoryFunction).toBeDefined();
    // Type
    expect(ensureArgument.isOptionalType).toBeDefined();
    expect(ensureArgument.isMandatoryType).toBeDefined();
    // EnumMember
    expect(ensureArgument.isEnumMember).toBeDefined();
  });

  it('hasValue method works', function () {
    function call1() { return ensureArgument.hasValue(); }
    function call2() { return ensureArgument.hasValue(null); }

    var any01 = ensureArgument.hasValue(false);
    var any02 = ensureArgument.hasValue(1);
    var any03 = ensureArgument.hasValue(-100.99);
    var any04 = ensureArgument.hasValue('');
    var any05 = ensureArgument.hasValue('Romeo and Juliet');
    var any06 = ensureArgument.hasValue([]);
    var any07 = ensureArgument.hasValue({});
    var any08 = ensureArgument.hasValue(function() {});
    var any09 = ensureArgument.hasValue(new Date());
    var any10 = ensureArgument.hasValue(new RegExp('[0-9]+'));

    expect(call1).toThrow();
    expect(call2).toThrow('The argument is required.');

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
    expect(any05).toBeDefined();
    expect(any06).toBeDefined();
    expect(any07).toBeDefined();
    expect(any08).toBeDefined();
    expect(any09).toBeDefined();
    expect(any10).toBeDefined();
  });

  it('isString method works', function () {
    function call01() { return ensureArgument.isString(); }
    function call02() { return ensureArgument.isString(null); }
    function call03() { return ensureArgument.isString(false); }
    function call04() { return ensureArgument.isString(1); }
    function call05() { return ensureArgument.isString(-100.99); }
    function call06() { return ensureArgument.isString([]); }
    function call07() { return ensureArgument.isString({}); }
    function call08() { return ensureArgument.isString(function() {}); }
    function call09() { return ensureArgument.isString(new Date()); }
    function call10() { return ensureArgument.isString(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isString('');
    var any02 = ensureArgument.isString('Romeo and Juliet');

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
  });

  it('isOptionalString method works', function () {
    function call01() { return ensureArgument.isOptionalString(false); }
    function call02() { return ensureArgument.isOptionalString(1); }
    function call03() { return ensureArgument.isOptionalString(-100.99); }
    function call04() { return ensureArgument.isOptionalString([]); }
    function call05() { return ensureArgument.isOptionalString({}); }
    function call06() { return ensureArgument.isOptionalString(function() {}); }
    function call07() { return ensureArgument.isOptionalString(new Date()); }
    function call08() { return ensureArgument.isOptionalString(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isOptionalString();
    var any02 = ensureArgument.isOptionalString(null);
    var any03 = ensureArgument.isOptionalString('');
    var any04 = ensureArgument.isOptionalString('Romeo and Juliet');

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
  });

  it('isMandatoryString method works', function () {
    function call01() { return ensureArgument.isMandatoryString(); }
    function call02() { return ensureArgument.isMandatoryString(null); }
    function call03() { return ensureArgument.isMandatoryString(false); }
    function call04() { return ensureArgument.isMandatoryString(1); }
    function call05() { return ensureArgument.isMandatoryString(-100.99); }
    function call06() { return ensureArgument.isMandatoryString([]); }
    function call07() { return ensureArgument.isMandatoryString({}); }
    function call08() { return ensureArgument.isMandatoryString(function() {}); }
    function call09() { return ensureArgument.isMandatoryString(new Date()); }
    function call10() { return ensureArgument.isMandatoryString(new RegExp('[0-9]+')); }
    function call11() { return ensureArgument.isMandatoryString(''); }

    var any01 = ensureArgument.isMandatoryString('Romeo and Juliet');

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();
    expect(call11).toThrow();

    expect(any01).toBeDefined();
  });

  it('isOptionalNumber method works', function () {
    function call01() { return ensureArgument.isOptionalNumber(false); }
    function call02() { return ensureArgument.isOptionalNumber(''); }
    function call03() { return ensureArgument.isOptionalNumber('Romeo and Juliet'); }
    function call04() { return ensureArgument.isOptionalNumber([]); }
    function call05() { return ensureArgument.isOptionalNumber({}); }
    function call06() { return ensureArgument.isOptionalNumber(function() {}); }
    function call07() { return ensureArgument.isOptionalNumber(new Date()); }
    function call08() { return ensureArgument.isOptionalNumber(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isOptionalNumber();
    var any02 = ensureArgument.isOptionalNumber(null);
    var any03 = ensureArgument.isOptionalNumber(1);
    var any04 = ensureArgument.isOptionalNumber(-100.99);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
  });

  it('isMandatoryNumber method works', function () {
    function call01() { return ensureArgument.isMandatoryNumber(); }
    function call02() { return ensureArgument.isMandatoryNumber(null); }
    function call03() { return ensureArgument.isMandatoryNumber(false); }
    function call04() { return ensureArgument.isMandatoryNumber(''); }
    function call05() { return ensureArgument.isMandatoryNumber('Romeo and Juliet'); }
    function call06() { return ensureArgument.isMandatoryNumber([]); }
    function call07() { return ensureArgument.isMandatoryNumber({}); }
    function call08() { return ensureArgument.isMandatoryNumber(function() {}); }
    function call09() { return ensureArgument.isMandatoryNumber(new Date()); }
    function call10() { return ensureArgument.isMandatoryNumber(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isMandatoryNumber(1);
    var any02 = ensureArgument.isMandatoryNumber(-100.99);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
  });

  it('isOptionalInteger method works', function () {
    function call01() { return ensureArgument.isOptionalInteger(false); }
    function call02() { return ensureArgument.isOptionalInteger(-100.99); }
    function call03() { return ensureArgument.isOptionalInteger(''); }
    function call04() { return ensureArgument.isOptionalInteger('Romeo and Juliet'); }
    function call05() { return ensureArgument.isOptionalInteger([]); }
    function call06() { return ensureArgument.isOptionalInteger({}); }
    function call07() { return ensureArgument.isOptionalInteger(function() {}); }
    function call08() { return ensureArgument.isOptionalInteger(new Date()); }
    function call09() { return ensureArgument.isOptionalInteger(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isOptionalInteger();
    var any02 = ensureArgument.isOptionalInteger(null);
    var any03 = ensureArgument.isOptionalInteger(1);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
  });

  it('isMandatoryInteger method works', function () {
    function call01() { return ensureArgument.isMandatoryInteger(); }
    function call02() { return ensureArgument.isMandatoryInteger(null); }
    function call03() { return ensureArgument.isMandatoryInteger(false); }
    function call04() { return ensureArgument.isMandatoryInteger(-100.99); }
    function call05() { return ensureArgument.isMandatoryInteger(''); }
    function call06() { return ensureArgument.isMandatoryInteger('Romeo and Juliet'); }
    function call07() { return ensureArgument.isMandatoryInteger([]); }
    function call08() { return ensureArgument.isMandatoryInteger({}); }
    function call09() { return ensureArgument.isMandatoryInteger(function() {}); }
    function call10() { return ensureArgument.isMandatoryInteger(new Date()); }
    function call11() { return ensureArgument.isMandatoryInteger(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isMandatoryNumber(1);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();
    expect(call11).toThrow();

    expect(any01).toBeDefined();
  });

  it('isOptionalBoolean method works', function () {
    function call01() { return ensureArgument.isOptionalBoolean(1); }
    function call02() { return ensureArgument.isOptionalBoolean(-100.99); }
    function call03() { return ensureArgument.isOptionalBoolean(''); }
    function call04() { return ensureArgument.isOptionalBoolean('Romeo and Juliet'); }
    function call05() { return ensureArgument.isOptionalBoolean([]); }
    function call06() { return ensureArgument.isOptionalBoolean({}); }
    function call07() { return ensureArgument.isOptionalBoolean(function() {}); }
    function call08() { return ensureArgument.isOptionalBoolean(new Date()); }
    function call09() { return ensureArgument.isOptionalBoolean(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isOptionalBoolean();
    var any02 = ensureArgument.isOptionalBoolean(null);
    var any03 = ensureArgument.isOptionalBoolean(true);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
  });

  it('isMandatoryBoolean method works', function () {
    function call01() { return ensureArgument.isMandatoryBoolean(); }
    function call02() { return ensureArgument.isMandatoryBoolean(null); }
    function call03() { return ensureArgument.isMandatoryBoolean(1); }
    function call04() { return ensureArgument.isMandatoryBoolean(-100.99); }
    function call05() { return ensureArgument.isMandatoryBoolean(''); }
    function call06() { return ensureArgument.isMandatoryBoolean('Romeo and Juliet'); }
    function call07() { return ensureArgument.isMandatoryBoolean([]); }
    function call08() { return ensureArgument.isMandatoryBoolean({}); }
    function call09() { return ensureArgument.isMandatoryBoolean(function() {}); }
    function call10() { return ensureArgument.isMandatoryBoolean(new Date()); }
    function call11() { return ensureArgument.isMandatoryBoolean(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isMandatoryBoolean(true);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();
    expect(call11).toThrow();

    expect(any01).toBeDefined();
  });

  it('isOptionalObject method works', function () {
    function call01() { return ensureArgument.isOptionalObject(false); }
    function call02() { return ensureArgument.isOptionalObject(1); }
    function call03() { return ensureArgument.isOptionalObject(-100.99); }
    function call04() { return ensureArgument.isOptionalObject(''); }
    function call05() { return ensureArgument.isOptionalObject('Romeo and Juliet'); }
    function call06() { return ensureArgument.isOptionalObject(function() {}); }

    var any01 = ensureArgument.isOptionalObject();
    var any02 = ensureArgument.isOptionalObject(null);
    var any03 = ensureArgument.isOptionalObject({});
    var any04 = ensureArgument.isOptionalObject([]);
    var any05 = ensureArgument.isOptionalObject(new Date());
    var any06 = ensureArgument.isOptionalObject(new RegExp('[0-9]+'));

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
    expect(any05).toBeDefined();
    expect(any06).toBeDefined();
  });

  it('isMandatoryObject method works', function () {
    function call01() { return ensureArgument.isMandatoryObject(); }
    function call02() { return ensureArgument.isMandatoryObject(null); }
    function call03() { return ensureArgument.isMandatoryObject(false); }
    function call04() { return ensureArgument.isMandatoryObject(1); }
    function call05() { return ensureArgument.isMandatoryObject(-100.99); }
    function call06() { return ensureArgument.isMandatoryObject(''); }
    function call07() { return ensureArgument.isMandatoryObject('Romeo and Juliet'); }
    function call08() { return ensureArgument.isMandatoryObject(function() {}); }

    var any01 = ensureArgument.isMandatoryObject({});
    var any02 = ensureArgument.isOptionalObject([]);
    var any03 = ensureArgument.isOptionalObject(new Date());
    var any04 = ensureArgument.isOptionalObject(new RegExp('[0-9]+'));

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
  });

  it('isOptionalFunction method works', function () {
    function call01() { return ensureArgument.isOptionalFunction(false); }
    function call02() { return ensureArgument.isOptionalFunction(1); }
    function call03() { return ensureArgument.isOptionalFunction(-100.99); }
    function call04() { return ensureArgument.isOptionalFunction(''); }
    function call05() { return ensureArgument.isOptionalFunction('Romeo and Juliet'); }
    function call06() { return ensureArgument.isOptionalFunction([]); }
    function call07() { return ensureArgument.isOptionalFunction({}); }
    function call08() { return ensureArgument.isOptionalFunction(new Date()); }
    function call09() { return ensureArgument.isOptionalFunction(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isOptionalFunction();
    var any02 = ensureArgument.isOptionalFunction(null);
    var any03 = ensureArgument.isOptionalFunction(function() {});

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
  });

  it('isMandatoryFunction method works', function () {
    function call01() { return ensureArgument.isMandatoryFunction(false); }
    function call02() { return ensureArgument.isMandatoryFunction(); }
    function call03() { return ensureArgument.isMandatoryFunction(null); }
    function call04() { return ensureArgument.isMandatoryFunction(1); }
    function call05() { return ensureArgument.isMandatoryFunction(-100.99); }
    function call06() { return ensureArgument.isMandatoryFunction(''); }
    function call07() { return ensureArgument.isMandatoryFunction('Romeo and Juliet'); }
    function call08() { return ensureArgument.isMandatoryFunction([]); }
    function call09() { return ensureArgument.isMandatoryFunction({}); }
    function call10() { return ensureArgument.isMandatoryFunction(new Date()); }
    function call11() { return ensureArgument.isMandatoryFunction(new RegExp('[0-9]+')); }

    var any01 = ensureArgument.isMandatoryFunction(function() {});

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();
    expect(call11).toThrow();

    expect(any01).toBeDefined();
  });

  it('isOptionalType method works', function () {
    function call01() { return ensureArgument.isOptionalType(false, Boolean); }
    function call02() { return ensureArgument.isOptionalType(1, Number); }
    function call03() { return ensureArgument.isOptionalType(-100.99, Number); }
    function call04() { return ensureArgument.isOptionalType('', String); }
    function call05() { return ensureArgument.isOptionalType('Romeo and Juliet', String); }

    var any01 = ensureArgument.isOptionalType(undefined, Object);
    var any02 = ensureArgument.isOptionalType(null, Object);
    var any03 = ensureArgument.isOptionalType([], Array);
    var any04 = ensureArgument.isOptionalType({}, Object);
    var any05 = ensureArgument.isOptionalType(new Date(), Date);
    var any06 = ensureArgument.isOptionalType(new RegExp('[0-9]+'), RegExp);
    var any07 = ensureArgument.isOptionalType(function() {}, Function);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
    expect(any05).toBeDefined();
    expect(any06).toBeDefined();
    expect(any07).toBeDefined();
  });

  it('isMandatoryType method works', function () {
    function call01() { return ensureArgument.isMandatoryType(undefined, Object); }
    function call02() { return ensureArgument.isMandatoryType(null, Object); }
    function call03() { return ensureArgument.isMandatoryType(false, Boolean); }
    function call04() { return ensureArgument.isMandatoryType(1, Number); }
    function call05() { return ensureArgument.isMandatoryType(-100.99, Number); }
    function call06() { return ensureArgument.isMandatoryType('', String); }
    function call07() { return ensureArgument.isMandatoryType('Romeo and Juliet', String); }

    var any01 = ensureArgument.isMandatoryType([], Array);
    var any02 = ensureArgument.isMandatoryType({}, Object);
    var any03 = ensureArgument.isMandatoryType(new Date(), Date);
    var any04 = ensureArgument.isMandatoryType(new RegExp('[0-9]+'), RegExp);
    var any05 = ensureArgument.isMandatoryType(function() {}, Function);

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
    expect(any05).toBeDefined();
  });

  it('isEnumMember method works', function () {
    var Numbers = numbers.three;

    function call01() { return ensureArgument.isEnumMember(undefined, Numbers); }
    function call02() { return ensureArgument.isEnumMember(null, Numbers); }
    function call03() { return ensureArgument.isEnumMember(false, Numbers); }
    function call04() { return ensureArgument.isEnumMember(1, Numbers); }
    function call05() { return ensureArgument.isEnumMember(-100.99, Numbers); }
    function call06() { return ensureArgument.isEnumMember('', Numbers); }
    function call07() { return ensureArgument.isEnumMember('Romeo and Juliet', Numbers); }
    function call08() { return ensureArgument.isEnumMember([], Numbers); }
    function call09() { return ensureArgument.isEnumMember({}, Numbers); }
    function call10() { return ensureArgument.isEnumMember(function() {}, Numbers); }
    function call11() { return ensureArgument.isEnumMember(new Date(), Numbers); }
    function call12() { return ensureArgument.isEnumMember(new RegExp('[0-9]+'), Numbers); }

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).not.toThrow();
    expect(call05).toThrow();
    expect(call06).toThrow();
    expect(call07).toThrow();
    expect(call08).toThrow();
    expect(call09).toThrow();
    expect(call10).toThrow();
    expect(call11).toThrow();
    expect(call12).toThrow();
  });
});
