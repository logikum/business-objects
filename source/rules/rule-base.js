'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var NotImplementedError = require('../shared/not-implemented-error.js');

var RuleBase = function () {

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
          throw new Error(
              'A Rule constructor can accept three kind of argument: ' +
              'a string as the message, an integer as the priority and ' +
              'a Boolean as the stopsProcessing argument.');
          break;
      }
    }
  }
  ensureArgument.isMandatoryString(this.message,
      'The message argument of Rule.initialize method must be a non-empty string.');
};

RuleBase.prototype.execute = function () {
  throw new NotImplementedError('method', 'Rule', 'execute');
};

RuleBase.prototype.result = function () {
  throw new NotImplementedError('method', 'Rule', 'result');
};

module.exports = RuleBase;
