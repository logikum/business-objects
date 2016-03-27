'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

var AddressView = Model('AddressView').readOnlyChildModel('dao', __filename)
    .integer('addressKey', F.key)
    .integer('orderKey', F.parentKey)
    .text('country')
    .text('state')
    .text('city')
    .text('line1')
    .text('line2')
    .text('postalCode')
    .compose();

module.exports = AddressView;
