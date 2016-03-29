'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderChild = require('./blanket-order-child.js');

var BlanketOrders = Model('BlanketOrders')
    .editableRootCollection('dao', __filename)
    // --- Collection elements
    .itemType(BlanketOrderChild)
    // --- Build model class
    .compose();

var BlanketOrdersFactory = {
  create: function (eventHandlers, callback) {
    BlanketOrders.create(eventHandlers, callback);
  },
  getAll: function (eventHandlers, callback) {
    BlanketOrders.fetch(null, null, eventHandlers, callback);
  },
  getFromTo: function (from, to, eventHandlers, callback) {
    BlanketOrders.fetch({ from: from, to: to }, 'fetchFromTo', eventHandlers, callback);
  }
};

module.exports = BlanketOrdersFactory;
