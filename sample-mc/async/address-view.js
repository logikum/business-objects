'use strict';

var Model = require('../../source/model-composer.js');

var bo = require('../../source/index.js');
var F = bo.shared.PropertyFlag;

var AddressView = Model('AddressView').readOnlyChildModel('dao', __filename)
    .integer('addressKey', F.key | F.readOnly)
    .integer('orderKey', F.parentKey | F.readOnly)
    .text('country')
    .text('state')
    .text('city')
    .text('line1')
    .text('line2')
    .text('postalCode')
    .Compose();

module.exports = AddressView;
