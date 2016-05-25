'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.shared.PropertyFlag;

const Address = new Model( 'Address' )
  .editableChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'addressKey', F.key | F.readOnly )
  .integer( 'orderKey', F.parentKey | F.readOnly )
  .text( 'country' )
    .required()
  .text( 'state' )
  .text( 'city' )
    .required()
  .text( 'line1' )
    .required()
  .text( 'line2' )
  .text( 'postalCode' )
    .required()
  // --- Build model class
  .compose();

module.exports = Address;
