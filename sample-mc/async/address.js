'use strict';

var Model = require('../../source/model-composer.js');

var bo = require('../../source/index.js');
var F = bo.shared.PropertyFlag;

var Address = Model('Address').editableChildModel('dao', __filename)
    .integer('addressKey', F.key | F.readOnly)
    .integer('orderKey', F.parentKey | F.readOnly)
    .text('country')
        .required()
    .text('state')
    .text('city')
        .required()
    .text('line1')
        .required()
    .text('line2')
    .text('postalCode')
        .required()
    .Compose();

module.exports = Address;
