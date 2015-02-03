'use strict';

var EnsureArgument = require('../shared/ensure-argument.js');
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
 * @param {internal~getValue} getValue - A function that returns the a property value.
 * @param {bo.rules.BrokenRuleList} brokenRules - The list of the broken rules.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The getProperty argument must be a function.
 * @throws {@link bo.system.ArgumentError Argument error}: The broken rules must be a BrokenRuleList object.
 */
function ValidationContext(getValue, brokenRules) {

  /**
   * Returns the value of a model property.
   * @type {internal~getValue}
   * @readonly
   */
  this.getValue = EnsureArgument.isMandatoryFunction(getValue,
      'c_manFunction', 'ValidationContext', 'getValue');
  /**
   * The list of the broken rules.
   * @type {bo.rules.BrokenRuleList}
   * @readonly
   */
  this.brokenRules = EnsureArgument.isMandatoryType(brokenRules, BrokenRuleList,
      'c_manType', 'ValidationContext', 'brokenRules');

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationContext;
