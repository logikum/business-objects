'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

//region Transfer object methods

function fromDto (ctx, dto) {
    ctx.setValue('addressKey',  dto.addressKey);
    ctx.setValue('orderKey',    dto.orderKey);
    ctx.setValue('country',     dto.country);
    ctx.setValue('state',       dto.state);
    ctx.setValue('city',        dto.city);
    ctx.setValue('line1',       dto.line1);
    ctx.setValue('line2',       dto.line2);
    ctx.setValue('postalCode',  dto.postalCode);
}

function toCto (ctx) {
    return {
        addressKey:     this.addressKey,
        orderKey:   this.orderKey,
        country: this.country,
        state:   this.state,
        city:    this.city,
        line1:      this.line1,
        line2:  this.line2,
        postalCode: this.postalCode
    };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method, callback) {
    ctx.setValue('addressKey', dto.addressKey);
    ctx.setValue('orderKey',   dto.orderKey);
    ctx.setValue('country',    dto.country);
    ctx.setValue('state',      dto.state);
    ctx.setValue('city',       dto.city);
    ctx.setValue('line1',      dto.line1);
    ctx.setValue('line2',      dto.line2);
    ctx.setValue('postalCode', dto.postalCode);
    callback(null, dto);
}

//endregion

var AddressView = Model('AddressView').readOnlyChildModel('async-dal', __filename)
    .integer('addressKey', F.key)
    .integer('orderKey', F.parentKey)
    .text('country')
    .text('state')
    .text('city')
    .text('line1')
    .text('line2')
    .text('postalCode')
    .daoBuilder(daoBuilder)
    .fromDto(fromDto)
    .toCto(toCto)
    .dataFetch(dataFetch)
    .compose();

module.exports = AddressView;
