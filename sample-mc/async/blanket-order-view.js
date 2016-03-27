'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;
var cr = bo.commonRules;

var AddressView = require('./address.js');
var BlanketOrderItemsView = require('./blanket-order-items.js');

var BlanketOrderView = Model('BlanketOrderView').readOnlyRootModel('dao', __filename)
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
    .canFetch(cr.isInRole, 'designers', 'You are not authorized to retrieve blanket order.')
    .Compose();

var BlanketOrderViewFactory = {
  get: function (key, eventHandlers, callback) {
    BlanketOrderView.fetch(key, null, eventHandlers, callback);
  },
  getByName: function (name, eventHandlers, callback) {
    BlanketOrderView.fetch(name, 'fetchByName', eventHandlers, callback);
  }
};

module.exports = BlanketOrderViewFactory;
