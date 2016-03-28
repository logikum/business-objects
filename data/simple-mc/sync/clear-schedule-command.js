'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;

var ClearScheduleCommand = Model('ClearScheduleCommand').commandObject('dao', __filename)
    .integer('orderKey')
    .integer('orderItemKey')
    .integer('orderScheduleKey')
    .boolean('result')
    .compose();

var ClearScheduleCommandFactory = {
  create: function (eventHandlers) {
    return ClearScheduleCommand.create(eventHandlers);
  }
};

module.exports = ClearScheduleCommandFactory;
