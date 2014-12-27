'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var cr = bo.commonRules;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var rules = new Rules(
);

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
    ctx.dao.fetchByName(filter, cb);
  } else {
    // filter: primaryKey
    ctx.dao.fetch(filter, cb);
  }
  // or:
  // ctx.dao[method](filter, cb);
}

//endregion

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.dataFetch = dataFetch;

var BlanketOrderList = bo.ReadOnlyRootCollection(
  'BlanketOrderList',
  BlanketOrderListItem,
  rules,
  extensions
);

var BlanketOrderListFactory = {
  getAll: function (callback) {
    return BlanketOrderList.fetch(null, callback);
  },
  getByName: function (name, callback) {
    return BlanketOrderList.fetch(name, 'fetchByName', callback);
  }
};

module.exports = BlanketOrderListFactory;
