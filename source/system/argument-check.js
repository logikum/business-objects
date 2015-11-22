/*
 * USAGE
 *
 * var Argument = require('./argument-check.js');
 *
 * var check;
 * var value = ...;
 * var msg = 'Wrong argument!';
 *
 * // Single usage:
 * value = Argument.check(value).for(VALUE_NAME).asString(msg);
 * value = Argument.inConstructor(CLASS_NAME).check(value).for(VALUE_NAME).asString(msg);
 * value = Argument.inMethod(CLASS_NAME, METHOD_NAME).check(value).for(VALUE_NAME).asString(msg);
 * value = Argument.inProperty(CLASS_NAME, PROPERTY_NAME).check(value).for(VALUE_NAME).asString(msg);
 *
 * // Multiple usage:
 * check = Argument();                                      // generic arguments
 * check = Argument.inConstructor(CLASS_NAME);              // constructor arguments
 * check = Argument.inMethod(CLASS_NAME, METHOD_NAME);      // method arguments
 * check = Argument.inProperty(CLASS_NAME, PROPERTY_NAME);  // property arguments
 *
 * value = check(value).for(VALUE_NAME).asString(msg);           // any or special argument
 * value = check(value).forOptional(VALUE_NAME).asString(msg);   // optional argument
 * value = check(value).forMandatory(VALUE_NAME).asString(msg);  // mandatory argument
 *
 * value = check(value).forOptional(VALUE_NAME).asType([ CollectionBase, ModelBase ], msg); // additional attribute
 * value = check(value).forMandatory(VALUE_NAME).asType(UserInfo, msg); // additional attribute
 *
 * value = check(value).for(VALUE_NAME).asEnumMember(Action, Action.Save, msg);  // two additional attributes
 */

var ArgumentError = require('./argument-error.js');
var ConstructorError = require('./constructor-error.js');
var MethodError = require('./method-error.js');
var PropertyError = require('./property-error.js');

//region Argument group

var ArgumentGroup = {
  General: 0,
  Constructor: 1,
  Method: 2,
  Property: 3
};

//endregion

//region Argument check

/**
 * Creates an argument check instance for the given value.
 *
 * @constructor
 * @param {*} value - The value to check.
 * @returns {bo.system.ArgumentCheck} The argument check instance.
 */
function ArgumentCheck (value) {
  this.value = value;
  return this;
}

//endregion

//region Argument check builder

//region For

/**
 * Sets the name of the argument.
 *
 * @function bo.system.ArgumentCheck.for
 * @param {string} argumentName - The name of the argument.
 * @returns {bo.system.ArgumentCheck} The argument check instance.
 */
function forGeneric  (argumentName) {
  this.argumentName = argumentName;
  return this;
}

/**
 * Sets the name of the optional argument.
 *
 * @function bo.system.ArgumentCheck.forOptional
 * @param {string} argumentName - The name of the optional argument.
 * @returns {bo.system.ArgumentCheck} The argument check instance.
 */
function forOptional (argumentName) {
  this.argumentName = argumentName;
  this.isMandatory = false;
  return this;
}

/**
 * Sets the name of the mandatory argument.
 *
 * @function bo.system.ArgumentCheck.forMandatory
 * @param {string} argumentName - The name of the mandatory argument.
 * @returns {bo.system.ArgumentCheck} The argument check instance.
 */
function forMandatory (argumentName) {
  this.argumentName = argumentName;
  this.isMandatory = true;
  return this;
}

//endregion

//region Exception

function exception (defaultMessage, userArguments) {
  var error, type;
  var message = defaultMessage;
  var parameters = [];
  if (userArguments && userArguments.length) {
    parameters = Array.prototype.slice.call(userArguments);
    message = parameters.shift() || defaultMessage;
  }
  var args = [message || 'default', this.argumentName];

  switch (this.argumentGroup) {
    case ArgumentGroup.Property:
      type = PropertyError;
      args.push(this.className || '<class>', this.propertyName || '<property>');
      break;
    case ArgumentGroup.Method:
      type = MethodError;
      args.push(this.className || '<class>', this.methodName || '<method>');
      break;
    case ArgumentGroup.Constructor:
      type = ConstructorError;
      args.push(this.className || '<class>');
      break;
    case ArgumentGroup.General:
    default:
      type = ArgumentError;
      break;
  }
  if (parameters.length) args.push(parameters);
  error = type.bind.apply(type, args);
  throw new error();
}

//endregion

//region General

/**
 * for: Checks if value is not undefined.
 *
 * @function bo.system.ArgumentCheck.asDefined
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {*} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be supplied.
 */
function asDefined () {
  if (this.value === undefined)
    this.exception('defined', arguments);
  return this.value;
}

/**
 * for: Checks if value is not undefined and is not null.
 *
 * @function bo.system.ArgumentCheck.hasValue
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {*} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument is required.
 */
function hasValue () {
  if (this.value === null || this.value === undefined)
    this.exception('required', arguments);
  return this.value;
}

//endregion

//region String

/**
 * for: Checks if value is a string.<br/>
 * forOptional: Checks if value is a string or null.<br/>
 * forMandatory: Checks if value is a non-empty string.
 *
 * @function bo.system.EnsureArgument.isString
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(string|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a string value.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a string value or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a non-empty string.
 */
function asString () {
  switch (this.isMandatory) {
    case true:
      if (typeof this.value !== 'string' && !(this.value instanceof String) || this.value.trim().length === 0)
        this.exception('manString', arguments);
      break;
    case false:
      if (this.value === undefined)
        this.value = null;
      if (this.value !== null && typeof this.value !== 'string' && !(this.value instanceof String))
        this.exception('optString', arguments);
      break;
    default:
      if (typeof this.value !== 'string' && !(this.value instanceof String))
        this.exception('string', arguments);
      break;
  }
  return this.value;
}

//endregion

//region Number

/**
 * forOptional: Checks if value is a number or null.<br/>
 * forMandatory: Checks if value is a number.
 *
 * @function bo.system.EnsureArgument.isOptionalNumber
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(number|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a number value or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a number value.
 */
function asNumber () {
  if (this.isMandatory) {
    if (typeof this.value !== 'number' && !(this.value instanceof Number))
      this.exception('manNumber', arguments);
  } else {
    if (this.value === undefined)
      this.value = null;
    if (this.value !== null && typeof this.value !== 'number' && !(this.value instanceof Number))
      this.exception('optNumber', arguments);
  }
  return this.value;
}

//endregion

//region Integer

/**
 * forOptional: Checks if value is an integer or null.<br/>
 * forMandatory: Checks if value is an integer.
 *
 * @function bo.system.EnsureArgument.isOptionalInteger
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(number|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an integer value or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an integer value.
 */
function asInteger () {
  if (this.isMandatory) {
    if (typeof this.value !== 'number' && !(this.value instanceof Number) || this.value % 1 !== 0)
      this.exception('manInteger', arguments);
  } else {
    if (this.value === undefined)
      this.value = null;
    if (this.value !== null && (typeof this.value !== 'number' &&
        !(this.value instanceof Number) || this.value % 1 !== 0))
      this.exception('optInteger', arguments);
  }
  return this.value;
}

//endregion

function ArgumentCheckBuilder (argumentGroup, className, methodName, propertyName) {

  var builderBase = {

    argumentGroup: argumentGroup || ArgumentGroup.General,
    className: className || '',
    methodName: methodName || '',
    propertyName: propertyName || '',

    argumentName: '',
    isMandatory: undefined,

    for: forGeneric,
    forOptional: forOptional,
    forMandatory: forMandatory,

    exception: exception,

    asDefined: asDefined,
    hasValue: hasValue,
    asString: asString
  };

  return ArgumentCheck.bind(builderBase);
}

//endregion

//region Argument check factory

function ArgumentCheckFactory() {
  return ArgumentCheckBuilder(ArgumentGroup.General, '', '', '');
}

ArgumentCheckFactory.check = function() {
  return ArgumentCheckBuilder(ArgumentGroup.General, '', '', '');
};

ArgumentCheckFactory.inConstructor = function (className) {
  return ArgumentCheckBuilder(ArgumentGroup.Constructor, className, '', '');
};

ArgumentCheckFactory.inMethod = function (className, methodName) {
  return ArgumentCheckBuilder(ArgumentGroup.Method, className, methodName, '');
};

ArgumentCheckFactory.inProperty = function (className, propertyName) {
  return ArgumentCheckBuilder(ArgumentGroup.Property, className, '', propertyName);
};

//endregion

module.exports = ArgumentCheckFactory;
