'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var cr = bo.commonRules;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var rules = new Rules(
);

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;

var BlanketOrderList = bo.ReadOnlyRootCollectionSync(
  'BlanketOrderList',
  BlanketOrderListItem,
  rules,
  extensions
);

var BlanketOrderListFactory = {
  getAll: function () {
    return BlanketOrderList.fetch();
  },
  getByName: function (name) {
    return BlanketOrderList.fetch(name, 'fetchByName');
  }
};

module.exports = BlanketOrderListFactory;
