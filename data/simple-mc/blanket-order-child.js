'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.shared.PropertyFlag;
const cr = bo.commonRules;

const Address = require( './address.js' );
const BlanketOrderItems = require( './blanket-order-items.js' );

const BlanketOrderChild = Model( 'BlanketOrderChild' )
  .editableChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'orderKey', F.key | F.readOnly )
  .text( 'vendorName' )
    .required()
  .dateTime( 'contractDate' )
    .required()
  .decimal( 'totalPrice' )
    .required()
  .integer( 'schedules' )
    .required()
  .boolean( 'enabled' )
    .required()
  .property( 'address', Address )
  .property( 'items', BlanketOrderItems )
  .dateTime( 'createdDate', F.readOnly )
  .dateTime( 'modifiedDate', F.readOnly )
  // --- Permissions
  .canFetch( cr.isInRole, 'developers', 'You are not authorized to retrieve blanket order.' )
  .canCreate( cr.isInRole, 'developers', 'You are not authorized to create blanket order.' )
  .canUpdate( cr.isInRole, 'developers', 'You are not authorized to modify blanket order.' )
  .canRemove( cr.isInRole, 'developers', 'You are not authorized to delete blanket order.' )
  // --- Build model class
  .compose();

module.exports = BlanketOrderChild;
