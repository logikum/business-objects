'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var AddressView = require('./address-view.js');
var BlanketOrderItemsView = require('./blanket-order-items-view.js');

var BlanketOrderView = Model('BlanketOrderView')
    .readOnlyRootModel('dao', __filename)
    // --- Properties
    .integer('orderKey', F.key)
    .text('vendorName')
    .dateTime('contractDate')
    .decimal('totalPrice')
        .canRead(cr.isInAnyRole, ['salesmen', 'administrators'], 'You are not authorized to view the totalPrice of the blanket order.')
    .integer('schedules')
    .boolean('enabled')
    .property('address', AddressView)
    .property('items', BlanketOrderItemsView)
    .dateTime('createdDate')
    .dateTime('modifiedDate')
    // --- Permissions
    .canFetch(cr.isInRole, 'designers', 'You are not authorized to retrieve blanket order.')
    // --- Build model class
    .compose();

var BlanketOrderViewFactory = {
  get: function (key, eventHandlers) {
    return BlanketOrderView.fetch(key, null, eventHandlers);
  },
  getByName: function (name, eventHandlers) {
    return BlanketOrderView.fetch(name, 'fetchByName', eventHandlers);
  }
};

module.exports = BlanketOrderViewFactory;
