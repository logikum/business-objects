'use strict';

var CLASS_NAME = 'PropertyManager';

var Argument = require('../system/argument-check.js');
var MethodError = require('../system/method-error.js');
var PropertyInfo = require('./property-info.js');
var DataType = require('../data-types/data-type.js');
var ModelError = require('./model-error.js');

/**
 * @classdesc Provides methods to manage the properties of a business object model.
 * @description Creates a new property manager object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {...bo.shared.PropertyInfo} [property] - Description of a model property.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The property must be PropertyInfo object.
 */
function PropertyManager (/*, property1, property2 [, ...] */) {

  var items = [];
  var changed = false;  // for children
  var children = [];
  var isFrozen = false;
  var modelName = CLASS_NAME;
  var check = Argument.inConstructor(CLASS_NAME);

  Array.prototype.slice.call(arguments)
      .forEach(function (arg) {
        items.push(check(arg).forMandatory().asType(PropertyInfo, 'properties'));
        changed = true;
      });

  /**
   * The name of the business object model.
   * @type {string}
   * @default 'PropertyManager'
   */
  Object.defineProperty(this, 'modelName', {
    get: function () {
      return modelName;
    },
    set: function (value) {
      modelName = Argument.inProperty(CLASS_NAME, 'modelName')
          .check(value).forMandatory().asString();
    },
    enumeration: true
  });

  //region Item management

  /**
   * Adds a new property to the business object model.
   *
   * @param {bo.shared.PropertyInfo} property - Description of the model property to add.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be PropertyInfo object.
   * @throws {@link bo.shared.ModelError Model error}: Cannot change the definition after creation.
   */
  this.add = function (property) {
    if (isFrozen)
      throw new ModelError('frozen', this.modelName);

    items.push(Argument.inMethod(CLASS_NAME, 'add')
        .check(property).forMandatory('property').asType(PropertyInfo));
    changed = true;
  };

  /**
   * Creates a new property for the business object model.
   *    </br></br>
   * The data type can be any one from the {@link bo.dataTypes} namespace
   * or a custom data type based on {@link bo.dataTypes.DataType DataType} object,
   * or can be any business object model or collection defined by the
   * model types available in the {@link bo} namespace (i.e. models based on
   * {@link bo.ModelBase ModelBase} or {@link bo.CollectionBase CollectionBase}
   * objects).
   *    </br></br>
   * The flags parameter is ignored when data type is a model or collection.
   *
   * @param {string} name - The name of the property.
   * @param {*} type - The data type of the property.
   * @param {bo.shared.PropertyFlag} [flags] - Other attributes of the property.
   * @returns {bo.shared.PropertyInfo} The definition of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The type must be a data type, a model or a collection.
   * @throws {@link bo.system.ArgumentError Argument error}: The flags must be PropertyFlag items.
   * @throws {@link bo.shared.ModelError Model error}: Cannot change the definition after creation.
   */
  this.create = function (name, type, flags) {
    if (isFrozen)
      throw new ModelError('frozen', this.modelName);

    var property = new PropertyInfo(name, type, flags);
    items.push(property);
    changed = true;
    return property;
  };

  /**
   * Determines whether a property belongs to the business object model.
   *
   * @param {bo.shared.PropertyInfo} property - Property definition to be checked.
   * @returns {boolean} True if the model contains the property, otherwise false.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be PropertyInfo object.
   */
  this.contains = function (property) {
    property = Argument.inMethod(CLASS_NAME, 'contains')
        .check(property).forMandatory('property').asType(PropertyInfo);

    return items.some(function (item) {
      return item.name === property.name;
    });
  };

  /**
   * Gets the property with the given name.
   *
   * @param {string} name - The name of the property.
   * @param {string} [message] - The error message in case of not finding the property.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {bo.shared.PropertyInfo} The requested property definition.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The business object has no property
   *    with the given name.
   */
  this.getByName = function (name, message) {
    name = Argument.inMethod(CLASS_NAME, 'getByName')
        .check(name).forMandatory('name').asString();

    for (var i = 0; i < items.length; i++) {
      if (items[i].name === name)
        return items[i];
    }
    throw new MethodError(message || 'noProperty', CLASS_NAME, 'getByName', 'name', this.modelName, name);
  };

  /**
   * Gets the property definitions of the business object model as an array.
   *
   * @returns {Array.<bo.shared.PropertyInfo>} The array of model properties.
   */
  this.toArray = function () {
    var array = items.filter(function (item) {
      return item.type instanceof DataType;
    });
    return array;
  };

  //endregion

  //region Public array methods

  /**
   * Executes the provided function once per property definition.
   *
   * @param {external.cbCollectionItem} callback - Function that produces an element
   *    of the model properties, taking three arguments: property, index, array.
   */
  this.forEach = function (callback) {
    items.forEach(callback);
  };

  /**
   * Creates a new array with all properties that pass the test implemented by the provided function.
   *
   * @param {external.cbCollectionItem} callback - Function to test each element of the properties,
   *    taking three arguments: property, index, array.
   *    Return true to keep the property definition, false otherwise.
   * @returns {Array.<bo.shared.PropertyInfo>} A new array with all properties that passed the test.
   */
  this.filter = function (callback) {
    return items.filter(callback);
  };

  /**
   * Creates a new array with the results of calling a provided function
   * on every element of the model properties.
   *
   * @param {external.cbCollectionItem} callback - Function that produces an element of the new array,
   *    taking three arguments: property, index, array.
   * @returns {Array} A new array with items produced by the function.
   */
  this.map = function (callback) {
    return items.map(callback);
  };

  //endregion

  //region Children

  function checkChildren () {
    if (changed) {
      children = items.filter(function (item) {
        return !(item.type instanceof DataType);
      });
      changed = false;
    }
  }

  /**
   * Gets the child models and collections of the current model.
   *
   * @returns {Array.<bo.shared.PropertyInfo>} - The array of the child properties.
   */
  this.children = function () {
    checkChildren();
    return children;
  };

  /**
   * Gets the count of the child models and collections of the current model.
   *
   * @returns {Number} The count of the child properties.
   */
  this.childCount = function () {
    checkChildren();
    return children.length;
  };

  /**
   * Verifies the model types of child models and freezes properties of the model.
   *
   * @param {Array.<string>} allowedTypes - The names of the model types of the allowed child models.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The allowed types must be
   *      an array of string values or a single string value.
   * @throws {@link bo.shared.ModelError Model error}: The type of a model property
   *      should be an allowed type.
   */
  this.verifyChildTypes = function (allowedTypes) {
    allowedTypes = Argument.inMethod(CLASS_NAME, 'verifyChildTypes')
        .check(allowedTypes).forMandatory('allowedTypes').asArray(String);

    checkChildren();
    var child;

    for (var i = 0; i < children.length; i++) {
      var matches = false;
      child = children[i];
      for (var j = 0; j < allowedTypes.length; j++) {
        if (child.type.modelType == allowedTypes[j]) {
          matches = true;
          break;
        }
      }
      if (!matches)
        throw new ModelError('invalidChild',
            this.modelName, child.name, child.type.modelType, allowedTypes.join(' | '));
    }
    isFrozen = true;
  };

  //endregion

  //region Keys

  /**
   * Gets the key of the current model.
   *    </br></br>
   * If the model has no key properties, the method returns the data transfer object,
   * If the model has one key property, then it returns the current value of the that property.
   * If the model has more key properties, an object will be returned whose properties will hold
   * the current values of the key properties.
   *
   * @protected
   * @param {internal~getValue} getPropertyValue - A function that returns
   *    the current value of the given property.
   * @returns {*} The key value of the model.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The getPropertyValue argument must be a function.
   */
  this.getKey = function (getPropertyValue) {

    getPropertyValue = Argument.inMethod(CLASS_NAME, 'getKey')
        .check(getPropertyValue).forMandatory('getPropertyValue').asFunction();

    // No properties - no keys.
    if (!items.length)
      return undefined;

    var key;
    // Get key properties.
    var keys = items.filter(function (item) {
      return item.isKey;
    });
    // Evaluate result.
    switch (keys.length) {
      case 0:
        // No keys: dto will be used.
        key = {};
        items.forEach(function (item) {
          if (item.isOnDto)
            key[item.name] = getPropertyValue(item);
        });
        break;
      case 1:
        // One key: key value will be used.
        key = getPropertyValue(keys[0]);
        break;
      default:
        // More keys: key object will be used.
        key = {};
        keys.forEach(function (item) {
          key[item.name] = getPropertyValue(item);
        });
    }
    return key;
  };

  /**
   * Determines that the passed data contains current values of the model key.
   *
   * @protected
   * @param {object} data - Data object whose properties can contain the values of the model key.
   * @param {internal~getValue} getPropertyValue - A function that returns
   *    the current value of the given property.
   * @returns {boolean} True when the values are equal, false otherwise.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The data argument must be an object.
   * @throws {@link bo.system.ArgumentError Argument error}: The getPropertyValue argument must be a function.
   */
  this.keyEquals = function (data, getPropertyValue) {
    var check = Argument.inMethod(CLASS_NAME, 'keyEquals');

    data = check(data).forMandatory('data').asObject();
    getPropertyValue = check(getPropertyValue).forMandatory('getPropertyValue').asFunction();

    // Get key properties.
    var keys = items.filter(function (item) {
      return item.isKey;
    });
    // Get key values.
    var values = {};
    if (keys.length) {
      keys.forEach(function (item) {
        values[item.name] = getPropertyValue(item);
      });
    } else {
      items.forEach(function (item) {
        if (item.isOnCto)
          values[item.name] = getPropertyValue(item);
      });
    }
    // Compare key values to data.
    for (var propertyName in values) {
      if (values.hasOwnProperty(propertyName)) {
        if (data[propertyName] === undefined || data[propertyName] !== values[propertyName])
          return false;
      }
    }
    return true;
  };

  //endregion

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyManager;
