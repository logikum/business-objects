'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var cr = bo.commonRules;

var BlanketOrderListItem = require('./blanket-order-list-item.js');

var rules = new Rules(
);

//region Transfer object methods

function toCto( ctx ) {
  var list = [];
  this.forEach( item => {
    list.push( item.toCto() );
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

var extensions = new Extensions('dal', __filename);
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
  getAll: function( eventHandlers ) {
    return BlanketOrderList.fetch( null, null, eventHandlers );
  },
  getByName: function( name, eventHandlers ) {
    return BlanketOrderList.fetch( name, 'fetchByName', eventHandlers );
  }
};

module.exports = BlanketOrderListFactory;
