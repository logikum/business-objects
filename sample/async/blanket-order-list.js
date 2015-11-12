'use strict';

var bo = require('../../source/index.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var cr = bo.commonRules;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var rules = new Rules(
);

var extensions = new Extensions('dao', __filename);

var BlanketOrderList = bo.ReadOnlyRootCollection(
    'BlanketOrderList',
    BlanketOrderListItem,
    rules,
    extensions
);

var BlanketOrderListFactory = {
  getAll: function (eventHandlers, callback) {
    BlanketOrderList.fetch(null, null, eventHandlers, callback);
  },
  getByName: function (name, eventHandlers, callback) {
    BlanketOrderList.fetch(name, 'fetchByName', eventHandlers, callback);
  }
};

module.exports = BlanketOrderListFactory;
