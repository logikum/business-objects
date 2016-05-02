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

function dataFetch( ctx, filter, method ) {
  function finish( dto ) {
    ctx.fulfill( dto );
  }
  if (method === 'fetchByName') {
    // filter: vendorName
    ctx.call( 'fetchByName', filter ).then( finish );
  } else {
    // filter: primaryKey
    ctx.fetch( filter ).then( finish );
  }
  // or:
  // ctx.call( method, filter ).then( finish );
}

//endregion

var BlanketOrderList = Model('BlanketOrderList')
    .readOnlyRootCollection('dal', __filename)
    // --- Collection elements
    .itemType(BlanketOrderListItem)
    // --- Customization
    .daoBuilder(daoBuilder)
    .toCto(toCto)
    .dataFetch(dataFetch)
    // --- Build model class
    .compose();

var BlanketOrderListFactory = {
  getAll: function (eventHandlers) {
    return BlanketOrderList.fetch(null, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderList.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderListFactory;
