'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var BlanketOrderList = Model('BlanketOrderList')
    .readOnlyRootCollection('dao', __filename)
    // --- Collection elements
    .itemType(BlanketOrderListItem)
    // --- Build model class
    .compose();

var BlanketOrderListFactory = {
  getAll: function (eventHandlers) {
    return BlanketOrderList.fetch(null, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderList.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderListFactory;
