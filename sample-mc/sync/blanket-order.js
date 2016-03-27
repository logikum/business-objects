'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var Address = require('./address.js');
var BlanketOrderItems = require('./blanket-order-items.js');

var BlanketOrder = Model('BlanketOrder').editableRootModel('dao', __filename)
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

var BlanketOrderFactory = {
  create: function (eventHandlers) {
    return BlanketOrder.create(eventHandlers);
  },
  get: function (key, eventHandlers) {
    return BlanketOrder.fetch(key, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrder.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderFactory;
