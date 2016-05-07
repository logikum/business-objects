'use strict';

const bo = require( '../../source/index.js' );

const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const cr = bo.commonRules;

const BlanketOrderListItem = require( './blanket-order-list-item.js' );

const rules = new Rules(
);

const extensions = new Extensions( 'dao', __filename );

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
