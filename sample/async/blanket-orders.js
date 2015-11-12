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
