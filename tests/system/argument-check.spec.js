console.log('Testing system/argument-check.js...');

var util = require('util');
var Argument = require('../../source/system/argument-check.js');
var Enumeration = require('../../source/system/enumeration.js');
var ModelBase = require('../../source/model-base.js');

var ClearScheduleCommand = require('../../sample/sync/clear-schedule-command.js');

describe('Argument checking function', function () {

  //region Factory

  it('returns a builder function', function () {
    var builder = Argument();

    expect(builder).toEqual(jasmine.any(Function));

    var check = builder();

    expect(check.argumentGroup).toBe(0); // ArgumentGroup.General
    expect(check.argumentName).toBe('');
    expect(check.className).toBe('');
    expect(check.methodName).toBe('');
    expect(check.propertyName).toBe('');

    // Generic
    expect(check.asDefined).toBeDefined();
    expect(check.hasValue).toBeDefined();
    // String
    expect(check.asString).toBeDefined();
    // Number
    expect(check.asNumber).toBeDefined();
    // Integer
    expect(check.asInteger).toBeDefined();
    // Boolean
    expect(check.asBoolean).toBeDefined();
    // Object
    expect(check.asObject).toBeDefined();
    // Function
    expect(check.asFunction).toBeDefined();
    // Type
    expect(check.asType).toBeDefined();
    // Model
    expect(check.asModelType).toBeDefined();
    // Enumeration
    expect(check.asEnumMember).toBeDefined();
    // Array
    expect(check.asArray).toBeDefined();
  });

  //endregion

  //region Factory functions

  it('provides the necessary factory functions', function () {
    var builder1 = Argument.check();
    var builder2 = Argument.inConstructor('CLASS_NAME');
    var builder3 = Argument.inMethod('CLASS_NAME', 'METHOD_NAME');
    var builder4 = Argument.inProperty('CLASS_NAME', 'PROPERTY_NAME');

    expect(builder1).toEqual(jasmine.any(Function));
    expect(builder2).toEqual(jasmine.any(Function));
    expect(builder3).toEqual(jasmine.any(Function));
    expect(builder4).toEqual(jasmine.any(Function));

    var check1 = builder1();

    expect(check1.argumentGroup).toBe(0); // ArgumentGroup.General
    expect(check1.argumentName).toBe('');
    expect(check1.className).toBe('');
    expect(check1.methodName).toBe('');
    expect(check1.propertyName).toBe('');

    var check2 = builder2();

    expect(check2.argumentGroup).toBe(1); // ArgumentGroup.Constructor
    expect(check2.argumentName).toBe('');
    expect(check2.className).toBe('CLASS_NAME');
    expect(check2.methodName).toBe('');
    expect(check2.propertyName).toBe('');

    var check3 = builder3();

    expect(check3.argumentGroup).toBe(2); // ArgumentGroup.Method
    expect(check3.argumentName).toBe('');
    expect(check3.className).toBe('CLASS_NAME');
    expect(check3.methodName).toBe('METHOD_NAME');
    expect(check3.propertyName).toBe('');

    var check4 = builder4();

    expect(check4.argumentGroup).toBe(3); // ArgumentGroup.Property
    expect(check4.argumentName).toBe('');
    expect(check4.className).toBe('CLASS_NAME');
    expect(check4.methodName).toBe('');
    expect(check4.propertyName).toBe('PROPERTY_NAME');
  });

  //endregion
});
