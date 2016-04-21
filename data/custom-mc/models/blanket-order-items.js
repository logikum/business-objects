'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderItem = require('./blanket-order-item.js');

var BlanketOrderItems = Model('BlanketOrderItems')
    .editableChildCollection()
    // --- Collection elements
    .itemType(BlanketOrderItem)
    // --- Build model class
    .compose();

module.exports = BlanketOrderItems;
