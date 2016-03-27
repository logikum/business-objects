'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

//region Property methods

function getAddressCode (ctx) {
    return ctx.getValue('addressKey').toString(2);
}

//endregion

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
        addressCode: this.addressCode,
        country:     this.country,
        state:       this.state,
        city:        this.city,
        line1:       this.line1,
        line2:       this.line2,
        postalCode:  this.postalCode
    };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method) {
    ctx.setValue('addressKey', dto.addressKey);
    ctx.setValue('orderKey',   dto.orderKey);
    ctx.setValue('country',    dto.country);
    ctx.setValue('state',      dto.state);
    ctx.setValue('city',       dto.city);
    ctx.setValue('line1',      dto.line1);
    ctx.setValue('line2',      dto.line2);
    ctx.setValue('postalCode', dto.postalCode);
    return dto;
}

//endregion

var AddressView = Model('AddressView').readOnlyChildModel('sync-dal', __filename)
    .integer('addressKey', F.key | F.onDtoOnly)
    .text('addressCode', F.onCtoOnly, getAddressCode)
    .integer('orderKey', F.parentKey | F.onDtoOnly)
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
