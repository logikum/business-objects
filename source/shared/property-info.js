'use strict';

var CLASS_NAME = 'PropertyInfo';

var EnsureArgument = require('./../system/ensure-argument.js');
var DataType = require('../data-types/data-type.js');
var PropertyFlag = require('../shared/property-flag.js');
var ModelBase = require('../model-base.js');
var CollectionBase = require('../collection-base.js');

/**
 * @classdesc
 *    Defines a property of a business object model.
 * @description
 *    Creates a new property definition.
 *      </br></br>
 *    The data type can be any one from the {@link bo.dataTypes} namespace
 *    or a custom data type based on {@link bo.dataTypes.DataType DataType} object,
 *    or can be any business object model or collection defined by the
 *    model types available in the {@link bo} namespace (i.e. models based on
 *    {@link bo.ModelBase ModelBase} or {@link bo.CollectionBase CollectionBase}
 *    objects).
 *      </br></br>
 *    The flags parameter is ignored when data type is a model or collection.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} name - The name of the property.
 * @param {*} type - The data type of the property.
 * @param {bo.shared.PropertyFlag} [flags] - Other attributes of the property.
 * @param {external.propertyGetter} [getter] - Custom function to read the value of the property.
 * @param {external.propertySetter} [setter] - Custom function to write the value of the property.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The type must be a data type, a model or a collection.
 * @throws {@link bo.system.ArgumentError Argument error}: The flags must be PropertyFlag items.
 */
function PropertyInfo (name, type, flags, getter, setter) {

  /**
   * The name of the property.
   * @type {string}
   * @readonly
   */
  this.name = EnsureArgument.isMandatoryString(name,
      'c_manString', CLASS_NAME, 'name');

  /**
   * The data type of the property.
   *    </br></br>
   * The data type can be any one from the {@link bo.dataTypes} namespace
   * or a custom data type based on {@link bo.dataTypes.DataType DataType} object,
   * or can be any business object model or collection defined by the
   * model types available in the {@link bo} namespace (i.e. models based on
   * {@link bo.ModelBase ModelBase} or {@link bo.CollectionBase CollectionBase}
   * objects).
   *
   * @type {*}
   * @readonly
   */
  this.type = EnsureArgument.isMandatoryType(type, [ DataType, ModelBase, CollectionBase ],
      'c_manType', CLASS_NAME, 'type');

  /**
   * The custom getter function of the property.
   * @type {external.propertyGetter}
   * @readonly
   */
  this.getter = EnsureArgument.isOptionalFunction(getter,
      'c_optFunction', CLASS_NAME, 'getter');

  /**
   * The custom setter function of the property.
   * @type {external.propertySetter}
   * @readonly
   */
  this.setter = EnsureArgument.isOptionalFunction(setter,
      'c_optFunction', CLASS_NAME, 'setter');

  flags = type instanceof DataType ?
    EnsureArgument.isMandatoryInteger(flags || PropertyFlag.none,
        'c_optInteger', CLASS_NAME, 'flags') :
    PropertyFlag.readOnly | PropertyFlag.notOnDto | PropertyFlag.notOnCto;

  /**
   * Indicates whether the value of the property can be modified.
   * @type {string}
   * @readonly
   */
  this.isReadOnly = (flags & PropertyFlag.readOnly) === PropertyFlag.readOnly;
  /**
   * Indicates if the property is a key element.
   * @type {string}
   * @readonly
   */
  this.isKey = (flags & PropertyFlag.key) === PropertyFlag.key;
  /**
   * Indicates if the property is a key element of the parent object.
   * @type {string}
   * @readonly
   */
  this.isParentKey = (flags & PropertyFlag.parentKey) === PropertyFlag.parentKey;
  /**
   * Indicates whether the value of the property would be passed to the data access object
   * or would be received from the data access object, respectively.
   * @type {string}
   * @readonly
   */
  this.isOnDto = (flags & PropertyFlag.notOnDto) === PropertyFlag.none;
  /**
   * Indicates whether the value of the property would be passed to the client
   * or would be received from the client, respectively.
   * @type {string}
   * @readonly
   */
  this.isOnCto = (flags & PropertyFlag.notOnCto) === PropertyFlag.none;

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyInfo;
