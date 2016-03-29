'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

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

var BlanketOrderList = Model('BlanketOrderList')
    .readOnlyRootCollection('async-dal', __filename)
    // --- Collection elements
    .itemType(BlanketOrderListItem)
    // --- Customization
    .daoBuilder(daoBuilder)
    .toCto(toCto)
    .dataFetch(dataFetch)
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
