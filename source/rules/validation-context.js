'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var BrokenRuleList = require('./broken-rule-list.js');

/**
 * @classdesc
 *    Provides the context for custom validation rules.
 * @description
 *    Creates a new validation context object.
 *      </br></br>
 *    <i><b>Warning:</b> Validation context objects are created in models internally.
 *    They are intended only to make publicly available the context
 *    for custom validation rules.</i>
 *
 * @memberof bo.rules
 * @constructor
 * @param {function} getProperty - A function that returns the current property.
 * @param {bo.rules.BrokenRuleList} brokenRules - The list of the broken rules.
 *
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The getProperty argument must be a function.
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The broken rules must be a BrokenRuleList object.
 */
function ValidationContext(getProperty, brokenRules) {

  /**
   * Returns the current property.
   * @type {function}
   * @readonly
   */
  this.getProperty = ensureArgument.isMandatoryFunction(getProperty,
      'c_manFunction', 'ValidationContext', 'getProperty');
  /**
   * The list of the broken rules.
   * @type {bo.rules.BrokenRuleList}
   * @readonly
   */
  this.brokenRules = ensureArgument.isMandatoryType(brokenRules, BrokenRuleList,
      'c_manType', 'ValidationContext', 'brokenRules');

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationContext;
