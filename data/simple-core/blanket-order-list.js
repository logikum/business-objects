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
  getAll: function (eventHandlers) {
    return BlanketOrderList.fetch(null, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderList.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderListFactory;
