'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var AuthorizationRule = require('./authorization-rule.js');
var ValidationRule = require('./validation-rule.js');

/**
 * @classdesc Represents the lists of rules of a model instance.
 * @description Creates a new rule list instance.
 *
 * @memberof bo.rules
 * @constructor
 */
function RuleList() {

  /**
   * Adds a new rule to the list of rules of its owner property.
   *
   * @function bo.rules.RuleList#add
   * @param {string} id - The identifier of the rule list, typically the property name.
   * @param {(bo.rules.ValidationRule|bo.rules.AuthorizationRule)} rule - A validation or authorization rule.
   *
   * @throws {@link bo.shared.ArgumentError Argument error}: The identifier must be a non-empty string.
   * @throws {@link bo.shared.ArgumentError Argument error}: The rule must be a ValidationRule or AuthorizationRule object.
   */
  this.add = function (id, rule) {

    id = ensureArgument.isMandatoryString(id,
        'm_manString', 'RuleList', 'add', 'id');
    rule = ensureArgument.isMandatoryType(rule, [ValidationRule, AuthorizationRule],
        'm_manType', 'RuleList', 'add', 'rule');

    if (this[id])
      this[id].push(rule);
    else
      this[id] = new Array(rule);
  };

  // Rules are sorted descending by priority.
  function sortByPriority (a, b) {
    if (a.priority > b.priority) {
      return -1;
    }
    if (a.priority < b.priority) {
      return 1;
    }
    return 0;
  }

  /**
   * Sorts the lists of rules by {@link bo.rules.RuleBase#priority rule priority}.
   *
   * @function bo.rules.RuleList#sort
   */
  this.sort = function () {
    for (var id in this) {
      if (this.hasOwnProperty(id) && this[id] instanceof Array) {
        this[id].sort(sortByPriority);
      }
    }
  };
}

module.exports = RuleList;
