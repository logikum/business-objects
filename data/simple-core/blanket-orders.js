'use strict';

var bo = require('../../source/index.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var cr = bo.commonRules;

var BlanketOrderChild = require('./blanket-order-child.js');

var rules = new Rules(
);

var extensions = new Extensions('dao', __filename);

var BlanketOrders = bo.EditableRootCollection(
    'BlanketOrders',
    BlanketOrderChild,
    rules,
    extensions
);

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
