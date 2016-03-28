'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;

var BlanketOrderItem = require('./blanket-order-item.js');

var BlanketOrderItems = Model('BlanketOrderItems').editableChildCollection()
    .itemType(BlanketOrderItem)
    .compose();

module.exports = BlanketOrderItems;
