'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var Address = require('./address.js');
var BlanketOrderItems = require('./blanket-order-items.js');

var BlanketOrderChild = Model('BlanketOrderChild').editableChildModel('dao', __filename)
    .integer('orderKey', F.key | F.readOnly)
    .text('vendorName')
        .required()
    .dateTime('contractDate')
        .required()
    .decimal('totalPrice')
        .required()
    .integer('schedules')
        .required()
    .boolean('enabled')
        .required()
    .property('address', Address)
    .property('items', BlanketOrderItems)
    .dateTime('createdDate', F.readOnly)
    .dateTime('modifiedDate', F.readOnly)
    .canFetch(cr.isInRole, 'developers', 'You are not authorized to retrieve blanket order.')
    .canCreate(cr.isInRole, 'developers', 'You are not authorized to create blanket order.')
    .canUpdate(cr.isInRole, 'developers', 'You are not authorized to modify blanket order.')
    .canRemove(cr.isInRole, 'developers', 'You are not authorized to delete blanket order.')
    .compose();

module.exports = BlanketOrderChild;
