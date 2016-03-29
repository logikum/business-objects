'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

var AddressView = Model('AddressView')
    .readOnlyChildObject('dao', __filename)
    // --- Properties
    .integer('addressKey', F.key)
    .integer('orderKey', F.parentKey)
    .text('country')
    .text('state')
    .text('city')
    .text('line1')
    .text('line2')
    .text('postalCode')
    // --- Build model class
    .compose();

module.exports = AddressView;
