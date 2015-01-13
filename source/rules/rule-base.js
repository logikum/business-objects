/**
 * Base rule module.
 * @module rules/rule-base
 */
'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var ArgumentError = require('../shared/argument-error.js');
var NotImplementedError = require('../shared/not-implemented-error.js');

var RuleBase = function (ruleName) {

  ruleName = ensureArgument.isMandatoryString(ruleName, 'c_manString', 'Rule', 'ruleName');
  Object.defineProperty(this, 'ruleName', {
    get: function () {
      return ruleName;
    },
    enumeration: true
  });

  this.message = null;
  this.priority = 10;
  this.stopsProcessing = false;
};

// function (message | priority | stopsProcessing)
RuleBase.prototype.initialize = function () {

  // Remove null and undefined arguments.
  var args = Array.prototype.slice.call(arguments).filter(function(arg) {
    return arg !== null && arg !== undefined;
  });

  if (args.length) {
    for (var i = 0; i < args.length; i++) {
      switch (typeof args[i]) {
        case 'string':
          this.message = args[i];
          break;
        case 'number':
          this.priority = Math.round(args[i]);
          break;
        case 'boolean':
          this.stopsProcessing = args[i];
          break;
        default:
          throw new ArgumentError('rule');
      }
    }
  }
  ensureArgument.isMandatoryString(this.message, 'm_manString', 'Rule', 'method', 'message');
};

RuleBase.prototype.execute = function () {
  throw new NotImplementedError('method', 'Rule', 'execute');
};

RuleBase.prototype.result = function () {
  throw new NotImplementedError('method', 'Rule', 'result');
};

module.exports = RuleBase;
