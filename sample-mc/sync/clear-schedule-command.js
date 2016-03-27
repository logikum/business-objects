'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var ClearScheduleCommand = Model('ClearScheduleCommand').commandObject('dao', __filename)
    .integer('orderKey')
    .integer('orderItemKey')
    .integer('orderScheduleKey')
    .boolean('result')
    .Compose();

var ClearScheduleCommandFactory = {
  create: function (eventHandlers) {
    return ClearScheduleCommand.create(eventHandlers);
  }
};

module.exports = ClearScheduleCommandFactory;
