'use strict';

const bo = require( '../../source/index.js' );

const Rules = bo.rules.RuleManager;
const Extensions = bo.shared.ExtensionManager;
const cr = bo.commonRules;

const BlanketOrderChild = require( './blanket-order-child.js' );

const rules = new Rules(
);

const extensions = new Extensions( 'dao', __filename );

const BlanketOrders = new bo.EditableRootCollection(
  'BlanketOrders',
  BlanketOrderChild,
  rules,
  extensions
);

const BlanketOrdersFactory = {
  create: function ( eventHandlers ) {
    return BlanketOrders.create( eventHandlers );
  },
  getAll: function ( eventHandlers ) {
    return BlanketOrders.fetch( null, null, eventHandlers );
  },
  getFromTo: function ( from, to, eventHandlers ) {
    return BlanketOrders.fetch( { from: from, to: to }, 'fetchFromTo', eventHandlers );
  }
};

module.exports = BlanketOrdersFactory;
