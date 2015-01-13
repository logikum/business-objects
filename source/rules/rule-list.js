/**
 * Rule list module.
 * @module rules/rule-list
 */
'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var Rule = require('./rule-base.js');

function RuleList() {

  this.add = function (id, rule) {

    id = ensureArgument.isMandatoryString(id,
        'c_manString', 'RuleList', 'add', 'id');
    rule = ensureArgument.isMandatoryType(rule, Rule,
        'c_manType', 'RuleList', 'add', 'rule');

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

  this.sort = function () {
    for (var id in this) {
      if (this.hasOwnProperty(id) && this[id] instanceof Array) {
        this[id].sort(sortByPriority);
      }
    }
  };
}

module.exports = RuleList;
