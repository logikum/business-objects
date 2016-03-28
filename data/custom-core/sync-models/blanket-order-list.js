'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var cr = bo.commonRules;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var rules = new Rules(
);

//region Transfer object methods

function toCto (ctx) {
  var list = [];
  this.forEach(function (item) {
    list.push(item.toCto());
  });
  return {
    list: list,
    totalItems: this.totalItems
  };
}

//endregion

//region Data portal methods

function dataFetch (ctx, filter, method) {
  var dto;
  if (method === 'fetchByName')
  // filter: vendorName
    dto = ctx.dao.fetchByName(ctx.connection, filter);
  else
  // filter: none
    dto = ctx.dao.fetch(ctx.connection, filter);
  // or:
  // var dto = ctx.dao[method](ctx.connection, filter);
  return dto;
}

//endregion

var extensions = new Extensions('sync-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var BlanketOrderList = bo.ReadOnlyRootCollectionSync(
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
