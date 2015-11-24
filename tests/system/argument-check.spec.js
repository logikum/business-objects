console.log('Testing system/argument-check.js...');

var util = require('util');
var Argument = require('../../source/system/argument-check.js');
var ArgumentError = require('../../source/system/argument-error.js');
var ConstructorError = require('../../source/system/constructor-error.js');
var MethodError = require('../../source/system/method-error.js');
var PropertyError = require('../../source/system/property-error.js');
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
    var builder1 = Argument();
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

  //region Argument value

  it('sets argument value', function () {
    var check = Argument.check({ a: 1, b: 2 });

    expect(check.value).toEqual({ a: 1, b: 2 });
  });

  //endregion

  //region Argument name and necessity

  it('sets argument name and necessity', function () {
    var check1 = Argument.check(true).for('VALUE_1');
    var check2 = Argument.check(1234).forOptional('VALUE_2');
    var check3 = Argument.check('value').forMandatory('VALUE_3');

    expect(check1.argumentName).toBe('VALUE_1');
    expect(check1.isMandatory).not.toBeDefined();
    expect(check2.argumentName).toBe('VALUE_2');
    expect(check2.isMandatory).toBe(false);
    expect(check3.argumentName).toBe('VALUE_3');
    expect(check3.isMandatory).toBe(true);
  });

  //endregion

  //region Exception

  it('throws the appropriate exception', function () {
    var ex1, ex2, ex3, ex4;
    try {
      var check1 = Argument.check(0).for('text').asString();
    } catch (ex) {
      ex1 = ex;
    }
    try {
      var check2 = Argument.inConstructor('CLASS_NAME').check(0).for('text').asString();
    } catch (ex) {
      ex2 = ex;
    }
    try {
      var check3 = Argument.inMethod('CLASS_NAME', 'METHOD_NAME').check(0).for('text').asString();
    } catch (ex) {
      ex3 = ex;
    }
    try {
      var check4 = Argument.inProperty('CLASS_NAME', 'PROPERTY_NAME').check(0).for('text').asString();
    } catch (ex) {
      ex4 = ex;
    }

    expect(ex1).toEqual(jasmine.any(ArgumentError));
    expect(ex1.name).toBe('ArgumentError');
    expect(ex1.message).toBe('The argument must be a string value.');

    expect(ex2).toEqual(jasmine.any(ConstructorError));
    expect(ex2.name).toBe('ConstructorError');
    expect(ex2.message).toBe('The text argument of CLASS_NAME constructor must be a string.');

    expect(ex3).toEqual(jasmine.any(MethodError));
    expect(ex3.name).toBe('MethodError');
    expect(ex3.message).toBe('The text argument of CLASS_NAME.METHOD_NAME method must be a string.');

    expect(ex4).toEqual(jasmine.any(PropertyError));
    expect(ex4.name).toBe('PropertyError');
    expect(ex4.message).toBe('The value of CLASS_NAME.PROPERTY_NAME property must be a string.');
  });

  //endregion
});
