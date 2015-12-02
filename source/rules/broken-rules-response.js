'use strict';

var CLASS_NAME = 'BrokenRulesResponse';

var t = require('../locales/i18n-bo.js')('Rules');
var Argument = require('../system/argument-check.js');
var BrokenRulesOutput = require('./broken-rules-output.js');

/**
 * @classdesc
 *      Represents the HTTP Response format of broken rules. The data property
 *      holds the information of broken rules.
 *
 *      If the model property is a simple property, i.e. it is defined by
 *      a {@link bo.dataTypes.DataType data type}, then the output property
 *      is an array. The array elements are objects with a message and a
 *      severity property, that represent the broken rules.
 *
 *      If the model property is a child model, then the output property
 *      is an object as well, whose properties represents model properties
 *      with broken rules, as described above.
 *
 *      If the model property is a child collection, then the output property
 *      is an object as well, whose properties are the indeces of the items of
 *      the collections. The property name is a number in '00000' format. The
 *      property value represents the child item, as described above.
 * @description
 *      Creates a new broken rules response instance.
 *
 * @memberof bo.rules
 * @param {bo.rules.BrokenRulesOutput} brokenRules - The broken rules to send to the client.
 * @param {string} [message] - Human-readable description of the reason of the failure.
 * @constructor
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The broken rules must be a BrokenRulesOutput object.
 * @throws {@link bo.system.ArgumentError Argument error}: The message must be a string value.
 */
function BrokenRulesResponse (brokenRules, message) {
  var check = Argument.inConstructor(CLASS_NAME);

  brokenRules = check(brokenRules).forMandatory('brokenRules').asType(BrokenRulesOutput);

  /**
   * The name of the response object.
   * @type {string}
   * @default
   * @readonly
   */
  this.name = 'BrokenRules';

  /**
   * The status code of the HTTP response.
   * @type {number}
   * @default
   * @readonly
   */
  this.status = 422;

  /**
   * Human-readable description of the reason of the failure.
   * @type {string}
   * @readonly
   */
  this.message = check(message || t('invalid')).for('message').asString();

  /**
   * The object of the broken rules.
   * @type {object}
   * @readonly
   */
  this.data = brokenRules;

  /**
   * The count of the broken rules.
   * @type {number}
   * @default
   * @read-only
   */
  this.count = brokenRules.$count;

  // Immutable object.
  Object.freeze(this);
}

module.exports = BrokenRulesResponse;
