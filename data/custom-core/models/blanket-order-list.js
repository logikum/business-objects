'use strict';

const bo = require( '../../../source/index.js' );
const daoBuilder = require( '../dao-builder.js' );

const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const cr = bo.commonRules;

const BlanketOrderListItem = require( './blanket-order-list-item.js' );

const rules = new Rules(
);

//region Transfer object methods

function toCto( ctx ) {
  const list = [];
  this.forEach( item => {
    list.push( item.toCto() );
  } );
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

const extensions = new Extensions( 'dal', __filename );
extensions.daoBuilder = daoBuilder;
extensions.toCto = toCto;
extensions.dataFetch = dataFetch;

const BlanketOrderList = bo.ReadOnlyRootCollection(
  'BlanketOrderList',
  BlanketOrderListItem,
  rules,
  extensions
);

const BlanketOrderListFactory = {
  getAll: function ( eventHandlers ) {
    return BlanketOrderList.fetch( null, null, eventHandlers );
  },
  getByName: function ( name, eventHandlers ) {
    return BlanketOrderList.fetch( name, 'fetchByName', eventHandlers );
  }
};

module.exports = BlanketOrderListFactory;
