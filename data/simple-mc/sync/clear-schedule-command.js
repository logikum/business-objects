'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;
var cr = bo.commonRules;

var ClearScheduleCommand = Model('ClearScheduleCommand')
    .commandObject('dao', __filename)
    // --- Properties
    .integer('orderKey')
    .integer('orderItemKey')
    .integer('orderScheduleKey')
    .boolean('result')
    // --- Permissions
    .canExecute(cr.isInRole, 'administrators', 'You are not authorized to execute the command.')
    // --- Build model class
    .compose();

var ClearScheduleCommandFactory = {
  create: function (eventHandlers) {
    return ClearScheduleCommand.create(eventHandlers);
  }
};

module.exports = ClearScheduleCommandFactory;
