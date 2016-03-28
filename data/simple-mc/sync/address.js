'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;
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
    .compose();

module.exports = Address;
