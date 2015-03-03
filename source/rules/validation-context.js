'use strict';

var CLASS_NAME = 'ValidationContext';

var EnsureArgument = require('../system/ensure-argument.js');
var DataStore = require('../shared/data-store.js');
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
 * @param {bo.shared.DataStore} dataStore - The storage of the property values.
 * @param {bo.rules.BrokenRuleList} brokenRules - The list of the broken rules.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The data store must be a DataStore object.
 * @throws {@link bo.system.ArgumentError Argument error}: The broken rules must be a BrokenRuleList object.
 */
function ValidationContext (dataStore, brokenRules) {

  dataStore = EnsureArgument.isMandatoryType(dataStore, DataStore,
      'c_manType', CLASS_NAME, 'dataStore');

  /**
   * Returns the value of a model property.
   * @type {internal~getValue}
   * @readonly
   */
  this.getValue = function (property) {
    return dataStore.hasValidValue(property) ? dataStore.getValue(property) : undefined;
  };

  /**
   * The list of the broken rules.
   * @type {bo.rules.BrokenRuleList}
   * @readonly
   */
  this.brokenRules = EnsureArgument.isMandatoryType(brokenRules, BrokenRuleList,
      'c_manType', CLASS_NAME, 'brokenRules');

  // Immutable object.
  Object.freeze(this);
}

module.exports = ValidationContext;
