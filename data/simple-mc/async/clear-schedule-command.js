'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;

var ClearScheduleCommand = Model('ClearScheduleCommand').commandObject('dao', __filename)
    .integer('orderKey')
    .integer('orderItemKey')
    .integer('orderScheduleKey')
    .boolean('result')
    .compose();

var ClearScheduleCommandFactory = {
  create: function (eventHandlers, callback) {
    ClearScheduleCommand.create(eventHandlers, callback);
  }
};

module.exports = ClearScheduleCommandFactory;
