console.log('Testing shared/ensure-argument.js...');

var util = require('util');
var EnsureArgument = require('../../source/shared/ensure-argument.js');
var Enumeration = require('../../source/shared/enumeration.js');
var ModelBase = require('../../source/model-base.js');

var ClearScheduleCommand = require('../../sample/sync/clear-schedule-command.js');

describe('Argument checking object', function () {

  it('has the necessary methods', function () {
    // Generic
    expect(EnsureArgument.isDefined).toBeDefined();
    expect(EnsureArgument.hasValue).toBeDefined();
    // String
    expect(EnsureArgument.isString).toBeDefined();
    expect(EnsureArgument.isOptionalString).toBeDefined();
    expect(EnsureArgument.isMandatoryString).toBeDefined();
    // Number
    expect(EnsureArgument.isOptionalNumber).toBeDefined();
    expect(EnsureArgument.isMandatoryNumber).toBeDefined();
    // Integer
    expect(EnsureArgument.isOptionalInteger).toBeDefined();
    expect(EnsureArgument.isMandatoryInteger).toBeDefined();
    // Boolean
    expect(EnsureArgument.isOptionalBoolean).toBeDefined();
    expect(EnsureArgument.isMandatoryBoolean).toBeDefined();
    // Object
    expect(EnsureArgument.isOptionalObject).toBeDefined();
    expect(EnsureArgument.isMandatoryObject).toBeDefined();
    // Function
    expect(EnsureArgument.isOptionalFunction).toBeDefined();
    expect(EnsureArgument.isMandatoryFunction).toBeDefined();
    // Type
    expect(EnsureArgument.isOptionalType).toBeDefined();
    expect(EnsureArgument.isMandatoryType).toBeDefined();
    // Model
    expect(EnsureArgument.isModelType).toBeDefined();
    // Enumeration
    expect(EnsureArgument.isEnumMember).toBeDefined();
    // Array
    expect(EnsureArgument.isOptionalArray).toBeDefined();
    expect(EnsureArgument.isMandatoryArray).toBeDefined();
  });

  //region Generic

  it('isDefined method works', function () {
    function call1() { return EnsureArgument.isDefined(); }

    var any01 = EnsureArgument.isDefined(null);
    var any02 = EnsureArgument.isDefined(false);
    var any03 = EnsureArgument.isDefined(1);
    var any04 = EnsureArgument.isDefined(-100.99);
    var any05 = EnsureArgument.isDefined('');
    var any06 = EnsureArgument.isDefined('Romeo and Juliet');
    var any07 = EnsureArgument.isDefined([]);
    var any08 = EnsureArgument.isDefined({});
    var any09 = EnsureArgument.isDefined(function() {});
    var any10 = EnsureArgument.isDefined(new Date());
    var any11 = EnsureArgument.isDefined(new RegExp('[0-9]+'));

    expect(call1).toThrow('The argument must be supplied.');

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
    expect(any11).toBeDefined();
  });

  it('hasValue method works', function () {
    function call1() { return EnsureArgument.hasValue(); }
    function call2() { return EnsureArgument.hasValue(null); }

    var any01 = EnsureArgument.hasValue(false);
    var any02 = EnsureArgument.hasValue(1);
    var any03 = EnsureArgument.hasValue(-100.99);
    var any04 = EnsureArgument.hasValue('');
    var any05 = EnsureArgument.hasValue('Romeo and Juliet');
    var any06 = EnsureArgument.hasValue([]);
    var any07 = EnsureArgument.hasValue({});
    var any08 = EnsureArgument.hasValue(function() {});
    var any09 = EnsureArgument.hasValue(new Date());
    var any10 = EnsureArgument.hasValue(new RegExp('[0-9]+'));

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

  //endregion

  //region String

  it('isString method works', function () {
    function call01() { return EnsureArgument.isString(); }
    function call02() { return EnsureArgument.isString(null); }
    function call03() { return EnsureArgument.isString(false); }
    function call04() { return EnsureArgument.isString(1); }
    function call05() { return EnsureArgument.isString(-100.99); }
    function call06() { return EnsureArgument.isString([]); }
    function call07() { return EnsureArgument.isString({}); }
    function call08() { return EnsureArgument.isString(function() {}); }
    function call09() { return EnsureArgument.isString(new Date()); }
    function call10() { return EnsureArgument.isString(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isString('');
    var any02 = EnsureArgument.isString('Romeo and Juliet');

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
    function call01() { return EnsureArgument.isOptionalString(false); }
    function call02() { return EnsureArgument.isOptionalString(1); }
    function call03() { return EnsureArgument.isOptionalString(-100.99); }
    function call04() { return EnsureArgument.isOptionalString([]); }
    function call05() { return EnsureArgument.isOptionalString({}); }
    function call06() { return EnsureArgument.isOptionalString(function() {}); }
    function call07() { return EnsureArgument.isOptionalString(new Date()); }
    function call08() { return EnsureArgument.isOptionalString(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isOptionalString();
    var any02 = EnsureArgument.isOptionalString(null);
    var any03 = EnsureArgument.isOptionalString('');
    var any04 = EnsureArgument.isOptionalString('Romeo and Juliet');

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
    function call01() { return EnsureArgument.isMandatoryString(); }
    function call02() { return EnsureArgument.isMandatoryString(null); }
    function call03() { return EnsureArgument.isMandatoryString(false); }
    function call04() { return EnsureArgument.isMandatoryString(1); }
    function call05() { return EnsureArgument.isMandatoryString(-100.99); }
    function call06() { return EnsureArgument.isMandatoryString([]); }
    function call07() { return EnsureArgument.isMandatoryString({}); }
    function call08() { return EnsureArgument.isMandatoryString(function() {}); }
    function call09() { return EnsureArgument.isMandatoryString(new Date()); }
    function call10() { return EnsureArgument.isMandatoryString(new RegExp('[0-9]+')); }
    function call11() { return EnsureArgument.isMandatoryString(''); }

    var any01 = EnsureArgument.isMandatoryString('Romeo and Juliet');

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

  //endregion

  //region Number

  it('isOptionalNumber method works', function () {
    function call01() { return EnsureArgument.isOptionalNumber(false); }
    function call02() { return EnsureArgument.isOptionalNumber(''); }
    function call03() { return EnsureArgument.isOptionalNumber('Romeo and Juliet'); }
    function call04() { return EnsureArgument.isOptionalNumber([]); }
    function call05() { return EnsureArgument.isOptionalNumber({}); }
    function call06() { return EnsureArgument.isOptionalNumber(function() {}); }
    function call07() { return EnsureArgument.isOptionalNumber(new Date()); }
    function call08() { return EnsureArgument.isOptionalNumber(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isOptionalNumber();
    var any02 = EnsureArgument.isOptionalNumber(null);
    var any03 = EnsureArgument.isOptionalNumber(1);
    var any04 = EnsureArgument.isOptionalNumber(-100.99);

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
    function call01() { return EnsureArgument.isMandatoryNumber(); }
    function call02() { return EnsureArgument.isMandatoryNumber(null); }
    function call03() { return EnsureArgument.isMandatoryNumber(false); }
    function call04() { return EnsureArgument.isMandatoryNumber(''); }
    function call05() { return EnsureArgument.isMandatoryNumber('Romeo and Juliet'); }
    function call06() { return EnsureArgument.isMandatoryNumber([]); }
    function call07() { return EnsureArgument.isMandatoryNumber({}); }
    function call08() { return EnsureArgument.isMandatoryNumber(function() {}); }
    function call09() { return EnsureArgument.isMandatoryNumber(new Date()); }
    function call10() { return EnsureArgument.isMandatoryNumber(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isMandatoryNumber(1);
    var any02 = EnsureArgument.isMandatoryNumber(-100.99);

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

  //endregion

  //region Integer

  it('isOptionalInteger method works', function () {
    function call01() { return EnsureArgument.isOptionalInteger(false); }
    function call02() { return EnsureArgument.isOptionalInteger(-100.99); }
    function call03() { return EnsureArgument.isOptionalInteger(''); }
    function call04() { return EnsureArgument.isOptionalInteger('Romeo and Juliet'); }
    function call05() { return EnsureArgument.isOptionalInteger([]); }
    function call06() { return EnsureArgument.isOptionalInteger({}); }
    function call07() { return EnsureArgument.isOptionalInteger(function() {}); }
    function call08() { return EnsureArgument.isOptionalInteger(new Date()); }
    function call09() { return EnsureArgument.isOptionalInteger(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isOptionalInteger();
    var any02 = EnsureArgument.isOptionalInteger(null);
    var any03 = EnsureArgument.isOptionalInteger(1);

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
    function call01() { return EnsureArgument.isMandatoryInteger(); }
    function call02() { return EnsureArgument.isMandatoryInteger(null); }
    function call03() { return EnsureArgument.isMandatoryInteger(false); }
    function call04() { return EnsureArgument.isMandatoryInteger(-100.99); }
    function call05() { return EnsureArgument.isMandatoryInteger(''); }
    function call06() { return EnsureArgument.isMandatoryInteger('Romeo and Juliet'); }
    function call07() { return EnsureArgument.isMandatoryInteger([]); }
    function call08() { return EnsureArgument.isMandatoryInteger({}); }
    function call09() { return EnsureArgument.isMandatoryInteger(function() {}); }
    function call10() { return EnsureArgument.isMandatoryInteger(new Date()); }
    function call11() { return EnsureArgument.isMandatoryInteger(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isMandatoryNumber(1);

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

  //endregion

  //region Boolean

  it('isOptionalBoolean method works', function () {
    function call01() { return EnsureArgument.isOptionalBoolean(1); }
    function call02() { return EnsureArgument.isOptionalBoolean(-100.99); }
    function call03() { return EnsureArgument.isOptionalBoolean(''); }
    function call04() { return EnsureArgument.isOptionalBoolean('Romeo and Juliet'); }
    function call05() { return EnsureArgument.isOptionalBoolean([]); }
    function call06() { return EnsureArgument.isOptionalBoolean({}); }
    function call07() { return EnsureArgument.isOptionalBoolean(function() {}); }
    function call08() { return EnsureArgument.isOptionalBoolean(new Date()); }
    function call09() { return EnsureArgument.isOptionalBoolean(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isOptionalBoolean();
    var any02 = EnsureArgument.isOptionalBoolean(null);
    var any03 = EnsureArgument.isOptionalBoolean(true);

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
    function call01() { return EnsureArgument.isMandatoryBoolean(); }
    function call02() { return EnsureArgument.isMandatoryBoolean(null); }
    function call03() { return EnsureArgument.isMandatoryBoolean(1); }
    function call04() { return EnsureArgument.isMandatoryBoolean(-100.99); }
    function call05() { return EnsureArgument.isMandatoryBoolean(''); }
    function call06() { return EnsureArgument.isMandatoryBoolean('Romeo and Juliet'); }
    function call07() { return EnsureArgument.isMandatoryBoolean([]); }
    function call08() { return EnsureArgument.isMandatoryBoolean({}); }
    function call09() { return EnsureArgument.isMandatoryBoolean(function() {}); }
    function call10() { return EnsureArgument.isMandatoryBoolean(new Date()); }
    function call11() { return EnsureArgument.isMandatoryBoolean(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isMandatoryBoolean(true);

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

  //endregion

  //region Object

  it('isOptionalObject method works', function () {
    function call01() { return EnsureArgument.isOptionalObject(false); }
    function call02() { return EnsureArgument.isOptionalObject(1); }
    function call03() { return EnsureArgument.isOptionalObject(-100.99); }
    function call04() { return EnsureArgument.isOptionalObject(''); }
    function call05() { return EnsureArgument.isOptionalObject('Romeo and Juliet'); }
    function call06() { return EnsureArgument.isOptionalObject(function() {}); }

    var any01 = EnsureArgument.isOptionalObject();
    var any02 = EnsureArgument.isOptionalObject(null);
    var any03 = EnsureArgument.isOptionalObject({});
    var any04 = EnsureArgument.isOptionalObject([]);
    var any05 = EnsureArgument.isOptionalObject(new Date());
    var any06 = EnsureArgument.isOptionalObject(new RegExp('[0-9]+'));

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
    function call01() { return EnsureArgument.isMandatoryObject(); }
    function call02() { return EnsureArgument.isMandatoryObject(null); }
    function call03() { return EnsureArgument.isMandatoryObject(false); }
    function call04() { return EnsureArgument.isMandatoryObject(1); }
    function call05() { return EnsureArgument.isMandatoryObject(-100.99); }
    function call06() { return EnsureArgument.isMandatoryObject(''); }
    function call07() { return EnsureArgument.isMandatoryObject('Romeo and Juliet'); }
    function call08() { return EnsureArgument.isMandatoryObject(function() {}); }

    var any01 = EnsureArgument.isMandatoryObject({});
    var any02 = EnsureArgument.isOptionalObject([]);
    var any03 = EnsureArgument.isOptionalObject(new Date());
    var any04 = EnsureArgument.isOptionalObject(new RegExp('[0-9]+'));

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

  //endregion

  //region Function

  it('isOptionalFunction method works', function () {
    function call01() { return EnsureArgument.isOptionalFunction(false); }
    function call02() { return EnsureArgument.isOptionalFunction(1); }
    function call03() { return EnsureArgument.isOptionalFunction(-100.99); }
    function call04() { return EnsureArgument.isOptionalFunction(''); }
    function call05() { return EnsureArgument.isOptionalFunction('Romeo and Juliet'); }
    function call06() { return EnsureArgument.isOptionalFunction([]); }
    function call07() { return EnsureArgument.isOptionalFunction({}); }
    function call08() { return EnsureArgument.isOptionalFunction(new Date()); }
    function call09() { return EnsureArgument.isOptionalFunction(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isOptionalFunction();
    var any02 = EnsureArgument.isOptionalFunction(null);
    var any03 = EnsureArgument.isOptionalFunction(function() {});

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
    function call01() { return EnsureArgument.isMandatoryFunction(false); }
    function call02() { return EnsureArgument.isMandatoryFunction(); }
    function call03() { return EnsureArgument.isMandatoryFunction(null); }
    function call04() { return EnsureArgument.isMandatoryFunction(1); }
    function call05() { return EnsureArgument.isMandatoryFunction(-100.99); }
    function call06() { return EnsureArgument.isMandatoryFunction(''); }
    function call07() { return EnsureArgument.isMandatoryFunction('Romeo and Juliet'); }
    function call08() { return EnsureArgument.isMandatoryFunction([]); }
    function call09() { return EnsureArgument.isMandatoryFunction({}); }
    function call10() { return EnsureArgument.isMandatoryFunction(new Date()); }
    function call11() { return EnsureArgument.isMandatoryFunction(new RegExp('[0-9]+')); }

    var any01 = EnsureArgument.isMandatoryFunction(function() {});

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

  //endregion

  //region Type

  it('isOptionalType method works', function () {
    function call01() { return EnsureArgument.isOptionalType(false, Boolean); }
    function call02() { return EnsureArgument.isOptionalType(1, Number); }
    function call03() { return EnsureArgument.isOptionalType(-100.99, Number); }
    function call04() { return EnsureArgument.isOptionalType('', String); }
    function call05() { return EnsureArgument.isOptionalType('Romeo and Juliet', String); }

    var any01 = EnsureArgument.isOptionalType(undefined, Object);
    var any02 = EnsureArgument.isOptionalType(null, Object);
    var any03 = EnsureArgument.isOptionalType([], Array);
    var any04 = EnsureArgument.isOptionalType({}, Object);
    var any05 = EnsureArgument.isOptionalType(new Date(), Date);
    var any06 = EnsureArgument.isOptionalType(new RegExp('[0-9]+'), RegExp);
    var any07 = EnsureArgument.isOptionalType(function() {}, Function);
    var any08 = EnsureArgument.isOptionalType({ x: 0 }, [ Function, Object ]);

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
    expect(any08).toBeDefined();
  });

  it('isMandatoryType method works', function () {
    function call01() { return EnsureArgument.isMandatoryType(undefined, Object); }
    function call02() { return EnsureArgument.isMandatoryType(null, Object); }
    function call03() { return EnsureArgument.isMandatoryType(false, Boolean); }
    function call04() { return EnsureArgument.isMandatoryType(1, Number); }
    function call05() { return EnsureArgument.isMandatoryType(-100.99, Number); }
    function call06() { return EnsureArgument.isMandatoryType('', String); }
    function call07() { return EnsureArgument.isMandatoryType('Romeo and Juliet', String); }

    var any01 = EnsureArgument.isMandatoryType([], Array);
    var any02 = EnsureArgument.isMandatoryType({}, Object);
    var any03 = EnsureArgument.isMandatoryType(new Date(), Date);
    var any04 = EnsureArgument.isMandatoryType(new RegExp('[0-9]+'), RegExp);
    var any05 = EnsureArgument.isMandatoryType(function() {}, Function);
    var any06 = EnsureArgument.isOptionalType({ x: 0 }, [ Function, Object ]);

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
    expect(any06).toBeDefined();
  });

  //endregion

  //region Model

  it('isModelType method works', function () {
    var cmd = ClearScheduleCommand.create();

    function call01() { return EnsureArgument.isModelType(undefined, 'CommandObjectSync'); }
    function call02() { return EnsureArgument.isModelType(null, 'CommandObjectSync'); }
    function call03() { return EnsureArgument.isModelType({}, 'CommandObjectSync'); }
    function call04() { return EnsureArgument.isModelType(cmd, 'CommandObject'); }
    function call05() { return EnsureArgument.isModelType(cmd, 'CommandObject', 'Invalid model type!'); }

    var cmd01 = EnsureArgument.isModelType(cmd, 'CommandObjectSync');

    expect(call01).toThrow();
    expect(call02).toThrow();
    expect(call03).toThrow();
    expect(call04).toThrow();
    expect(call05).toThrow('Invalid model type!');

    expect(cmd01).toBe(cmd);
  });

  //endregion

  //region Enumeration

  it('isEnumMember method works', function () {
    function Numbers1() {
      Enumeration.call(this);
      this.one = 0;
      this.two = 1;
      this.three = 2;
      Object.freeze(this);
    }
    util.inherits(Numbers1, Enumeration);
    var Numbers = new Numbers1();

    function call01() { return EnsureArgument.isEnumMember(undefined, Numbers); }
    function call02() { return EnsureArgument.isEnumMember(null, Numbers); }
    function call03() { return EnsureArgument.isEnumMember(false, Numbers); }
    function call04() { return EnsureArgument.isEnumMember(1, Numbers); }
    function call05() { return EnsureArgument.isEnumMember(-100.99, Numbers); }
    function call06() { return EnsureArgument.isEnumMember('', Numbers); }
    function call07() { return EnsureArgument.isEnumMember('Romeo and Juliet', Numbers); }
    function call08() { return EnsureArgument.isEnumMember([], Numbers); }
    function call09() { return EnsureArgument.isEnumMember({}, Numbers); }
    function call10() { return EnsureArgument.isEnumMember(function() {}, Numbers); }
    function call11() { return EnsureArgument.isEnumMember(new Date(), Numbers); }
    function call12() { return EnsureArgument.isEnumMember(new RegExp('[0-9]+'), Numbers); }

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

  //endregion

  //region Array

  it('isOptionalArray method works', function () {
    function call1() { return EnsureArgument.isOptionalArray(false, String); }
    function call2() { return EnsureArgument.isOptionalArray(1, String); }
    function call3() { return EnsureArgument.isOptionalArray(-100.99, String); }
    function call4() { return EnsureArgument.isOptionalArray({}, String); }
    function call5() { return EnsureArgument.isOptionalArray(function() {}, String); }
    function call6() { return EnsureArgument.isOptionalArray(new Date(), String); }
    function call7() { return EnsureArgument.isOptionalArray(new RegExp('[0-9]+'), String); }
    function call8() { return EnsureArgument.isOptionalArray(['first', 13], String); }

    var any01 = EnsureArgument.isOptionalArray(undefined, String);
    var any02 = EnsureArgument.isOptionalArray(null, String);
    var any03 = EnsureArgument.isOptionalArray('', String);
    var any04 = EnsureArgument.isOptionalArray('Romeo and Juliet', String);
    var any05 = EnsureArgument.isOptionalArray(['one'], String);
    var any06 = EnsureArgument.isOptionalArray(['one', 'two', 'three'], String);
    var any07 = EnsureArgument.isOptionalArray(new ModelBase(), ModelBase);
    var any08 = EnsureArgument.isOptionalArray([new ModelBase(), new ModelBase()], ModelBase);

    expect(call1).toThrow();
    expect(call2).toThrow();
    expect(call3).toThrow();
    expect(call4).toThrow();
    expect(call5).toThrow();
    expect(call6).toThrow();
    expect(call7).toThrow();
    expect(call8).toThrow();

    expect(any01).toBeDefined();
    expect(any02).toBeDefined();
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
    expect(any05).toBeDefined();
    expect(any06).toBeDefined();
    expect(any07).toBeDefined();
    expect(any08).toBeDefined();
  });

  it('isMandatoryArray method works', function () {
    function call01() { return EnsureArgument.isMandatoryArray(undefined, String); }
    function call02() { return EnsureArgument.isMandatoryArray(null, String); }
    function call03() { return EnsureArgument.isMandatoryArray(false, String); }
    function call04() { return EnsureArgument.isMandatoryArray(1, String); }
    function call05() { return EnsureArgument.isMandatoryArray(-100.99, String); }
    function call06() { return EnsureArgument.isMandatoryArray({}, String); }
    function call07() { return EnsureArgument.isMandatoryArray(function() {}, String); }
    function call08() { return EnsureArgument.isMandatoryArray(new Date(), String); }
    function call09() { return EnsureArgument.isMandatoryArray(new RegExp('[0-9]+'), String); }
    function call10() { return EnsureArgument.isMandatoryArray(['first', 13], String); }

    var any01 = EnsureArgument.isMandatoryArray('', String);
    var any02 = EnsureArgument.isMandatoryArray('Romeo and Juliet', String);
    var any03 = EnsureArgument.isMandatoryArray(['one'], String);
    var any04 = EnsureArgument.isMandatoryArray(['one', 'two', 'three'], String);
    var any05 = EnsureArgument.isMandatoryArray(new ModelBase(), ModelBase);
    var any06 = EnsureArgument.isMandatoryArray([new ModelBase(), new ModelBase()], ModelBase);

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
    expect(any03).toBeDefined();
    expect(any04).toBeDefined();
    expect(any05).toBeDefined();
    expect(any06).toBeDefined();
  });

  //endregion
});
