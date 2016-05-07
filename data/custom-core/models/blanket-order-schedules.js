'use strict';

const bo = require( '../../../source/index.js' );

const BlanketOrderSchedule = require( './blanket-order-schedule.js' );

const BlanketOrderSchedules = bo.EditableChildCollection(
  'BlanketOrderSchedules',
  BlanketOrderSchedule
);

module.exports = BlanketOrderSchedules;
