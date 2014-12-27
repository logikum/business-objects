'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var cr = bo.commonRules;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var rules = new Rules(
);

//region Data portal methods

function dataFetch (ctx, filter, method) {
  var dto;
  if (method === 'fetchByName')
  // filter: vendorName
    dto = ctx.dao.fetchByName(filter);
  else
  // filter: none
    dto = ctx.dao.fetch(filter);
  // or:
  // var dto = ctx.dao[method](filter);
  return dto;
}

//endregion

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.dataFetch = dataFetch;

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
