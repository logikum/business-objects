'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderChild = require('./blanket-order-child.js');

var BlanketOrders = Model('BlanketOrders')
    .editableRootCollection('dao', __filename)
    // --- Collection elements
    .itemType(BlanketOrderChild)
    // --- Build model class
    .compose();

var BlanketOrdersFactory = {
  create: function (eventHandlers) {
    return BlanketOrders.create(eventHandlers);
  },
  getAll: function (eventHandlers) {
    return BlanketOrders.fetch(null, null, eventHandlers);
  },
  getFromTo: function (from, to, eventHandlers) {
    return BlanketOrders.fetch({ from: from, to: to }, 'fetchFromTo', eventHandlers);
  }
};

module.exports = BlanketOrdersFactory;
