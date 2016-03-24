'use strict';

var Model = require('../../source/model-composer.js');

var BlanketOrderItem = require('./blanket-order-item.js');

var BlanketOrderItems = Model('BlanketOrderItems').editableChildCollection()
    .itemType(BlanketOrderItem)
    .Compose();

module.exports = BlanketOrderItems;
