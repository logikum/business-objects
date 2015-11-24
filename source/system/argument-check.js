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
  var args = [null, message || 'default'];

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
  args.push(this.argumentName);
  if (parameters.length)
    args.push(parameters);

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
 * @function bo.system.ArgumentCheck.asString
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
 * @function bo.system.ArgumentCheck.asNumber
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
 * @function bo.system.ArgumentCheck.asInteger
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

//region Boolean

/**
 * forOptional: Checks if value is a Boolean or null.<br/>
 * forMandatory: Checks if value is a Boolean.
 *
 * @function bo.system.ArgumentCheck.asBoolean
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(boolean|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a Boolean value or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a Boolean value.
 */
function asBoolean () {
  if (this.isMandatory) {
    if (typeof this.value !== 'boolean' && !(this.value instanceof Boolean))
      this.exception('manBoolean', arguments);
  } else {
    if (this.value === undefined)
      this.value = null;
    if (this.value !== null && typeof this.value !== 'boolean' && !(this.value instanceof Boolean))
      this.exception('optBoolean', arguments);
  }
  return this.value;
}

//endregion

//region Object

/**
 * forOptional: Checks if value is an object or null.<br/>
 * forMandatory: Checks if value is an object.
 *
 * @function bo.system.ArgumentCheck.asObject
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(object|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an object or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an object.
 */
function asObject () {
  if (this.isMandatory) {
    if (typeof this.value !== 'object' || this.value === null)
      this.exception('manObject', arguments);
  } else {
    if (this.value === undefined)
      this.value = null;
    if (typeof this.value !== 'object')
      this.exception('optObject', arguments);
  }
  return this.value;
}

//endregion

//region Function

/**
 * forOptional: Checks if value is a function or null.<br/>
 * forMandatory: Checks if value is a function.
 *
 * @function bo.system.ArgumentCheck.asFunction
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(function|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a function or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a function.
 */
function asFunction () {
  if (this.isMandatory) {
    if (typeof this.value !== 'function')
      this.exception('manFunction', arguments);
  } else {
    if (this.value === undefined)
      this.value = null;
    if (this.value !== null && typeof this.value !== 'function')
      this.exception('optFunction', arguments);
  }
  return this.value;
}

//endregion

//region Type

function typeNames (types) {
  var list = '<< no types >>';
  if (types.length) {
    list = types.map(function (type) {
      return type.name ? type.name : '-unknown-'
    }).join(' | ');
  }
  return list;
}

/**
 * forOptional: Checks if value is a given type or null.<br/>
 * forMandatory: Checks if value is a given type.
 *
 * @function bo.system.ArgumentCheck.asType
 * @param {(constructor|Array.<constructor>)} type - The type that value must inherit.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(object|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a TYPE object or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a TYPE object.
 */
function asType () {
  var args = Array.prototype.slice.call(arguments);
  var type = args.shift();
  var types = type instanceof Array ? type : [ type ];

  if (this.isMandatory) {
    if (!(types.some(function (option) {
          return this.value && (this.value instanceof option || this.value.super_ === option);
        }))) {
      args.unshift(typeNames(types));
      this.exception('manType', args);
    }
  } else {
    if (this.value === undefined)
      this.value = null;
    if (this.value !== null && !(types.some(function (option) {
          return this.value && (this.value instanceof option || this.value.super_ === option);
        }))) {
      args.unshift(typeNames(types));
      this.exception('manType', args);
    }
  }
  return this.value;
}

//endregion

//region Model

/**
 * for: Checks if value is an instance of a given model type.
 *
 * @function bo.system.ArgumentCheck.asModelType
 * @param {(constructor|Array.<constructor>)} model - The model type that value must be an instance of.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {object} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a model type.
 */
function asModelType () {
  var args = Array.prototype.slice.call(arguments);
  var model = args.shift();
  var models = model instanceof Array ? model : [ model ];

  if (!(models.some(function (modelType) {
        return this.value && this.value.constructor && this.value.constructor.modelType === modelType;
      }))) {
    args.unshift(models.join(' | '));
    this.exception('manType', args);
  }
  return this.value;
}

//endregion

//region Enumeration

/**
 * for: Checks if value is member of a given enumeration.
 *
 * @function bo.system.ArgumentCheck.asEnumMember
 * @param {constructor} type - The type of the enumeration.
 * @param {number} [defaultValue] - The type of the enumeration.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {number} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: Type is not an enumeration type.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an enumeration type item.
 */
function asEnumMember () {
  var args = Array.prototype.slice.call(arguments);
  var type = args.shift();
  var defaultValue = args.shift();

  if (!(type && type.hasMember && type.constructor &&
      type.constructor.super_ && type.constructor.super_.name === 'Enumeration'))
    this.exception('enumType', arguments);
  if ((this.value === null || this.value === undefined) && typeof defaultValue === 'number')
    this.value = defaultValue;
  if (!type.hasMember(this.value))
    this.exception('enumMember', arguments);

  return this.value;
}

//endregion

//region Array

/**
 * forOptional: Checks if value is an array of a given type or null.<br/>
 * forMandatory: Checks if value is an array of a given type.
 *
 * @function bo.system.ArgumentCheck.asArray
 * @param {*} type - The type of the array items - a primitive type or a constructor.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(Array.<type>|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE values, or a single TYPE value or null.
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE objects, or a single TYPE object or null.
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE values, or a single TYPE value.
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE objects, or a single TYPE object.
 */
function asArray () {
  if (!this.isMandatory) {
    if (this.value === undefined || this.value === null)
      return [];
  }
  var msgKey;
  var type = Array.prototype.slice.call(arguments).shift();

  if (type === String || type === Number || type === Boolean) {
    msgKey = this.isMandatory ? 'manArrayPrim' : 'optArrayPrim';
    var typeName = type.name.toLowerCase();

    if (typeof this.value === typeName || this.value instanceof type)
      return [this.value];
    if (this.value instanceof Array && (!this.value.length || this.value.every(function (item) {
          return typeof item === typeName || item instanceof type;
        })))
      return this.value;
  } else {
    msgKey = this.isMandatory ? 'manArray' : 'optArray';

    if (this.value instanceof type)
      return [this.value];
    if (this.value instanceof Array && (!this.value.length || this.value.every(function (item) {
          return item instanceof type;
        })))
      return this.value;
  }
  this.exception(msgKey, arguments);
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
    asString: asString,
    asNumber: asNumber,
    asInteger: asInteger,
    asBoolean: asBoolean,
    asObject: asObject,
    asFunction: asFunction,
    asType: asType,
    asModelType: asModelType,
    asEnumMember: asEnumMember,
    asArray: asArray
  };

  var fnCheck = ArgumentCheck.bind(builderBase);

  fnCheck.check = function (value) {
    return this(value);
  };

  return fnCheck;
}

//endregion

//region Argument check factory

function ArgumentCheckFactory() {
  return ArgumentCheckBuilder(ArgumentGroup.General, '', '', '');
}

ArgumentCheckFactory.check = function(value) {
  return ArgumentCheckBuilder(ArgumentGroup.General, '', '', '')(value);
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
