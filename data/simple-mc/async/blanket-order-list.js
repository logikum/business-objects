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
  getAll: function (eventHandlers, callback) {
    BlanketOrderList.fetch(null, null, eventHandlers, callback);
  },
  getByName: function (name, eventHandlers, callback) {
    BlanketOrderList.fetch(name, 'fetchByName', eventHandlers, callback);
  }
};

module.exports = BlanketOrderListFactory;
