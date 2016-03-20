'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
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

function dataFetch (ctx, filter, method, callback) {
  function cb (err, dto) {
    if (err)
      callback(err);
    else
      callback(null, dto);
  }
  if (method === 'fetchByName') {
    // filter: vendorName
    ctx.dao.fetchByName(ctx.connection, filter, cb);
  } else {
    // filter: primaryKey
    ctx.dao.fetch(ctx.connection, filter, cb);
  }
  // or:
  // ctx.dao[method](ctx.connection, filter, cb);
}

//endregion

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

var BlanketOrderList = bo.ReadOnlyRootCollection(
    'BlanketOrderList',
    BlanketOrderListItem,
    rules,
    extensions
);

var BlanketOrderListFactory = {
  getAll: function (eventHandlers, callback) {
    return BlanketOrderList.fetch(null, null, eventHandlers, callback);
  },
  getByName: function (name, eventHandlers, callback) {
    return BlanketOrderList.fetch(name, 'fetchByName', eventHandlers, callback);
  }
};

module.exports = BlanketOrderListFactory;
