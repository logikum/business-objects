'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var addressKey = new Property('addressKey', dt.Integer, F.key | F.readOnly);
var orderKey = new Property('orderKey', dt.Integer, F.parentKey | F.readOnly);
var country = new Property('country', dt.Text);
var state = new Property('state', dt.Text);
var city = new Property('city', dt.Text);
var line1 = new Property('line1', dt.Text);
var line2 = new Property('line2', dt.Text);
var postalCode = new Property('postalCode', dt.Text);

var properties = new Properties(
    'Address',
    addressKey,
    orderKey,
    country,
    state,
    city,
    line1,
    line2,
    postalCode
);

var rules = new Rules(
    cr.required(country),
    cr.required(city),
    cr.required(line1),
    cr.required(postalCode)
);

//region Transfer object methods

function toDto (ctx) {
    return {
        addressKey: ctx.getValue('addressKey'),
        orderKey:   ctx.getValue('orderKey'),
        country:    ctx.getValue('country'),
        state:      ctx.getValue('state'),
        city:       ctx.getValue('city'),
        line1:      ctx.getValue('line1'),
        line2:      ctx.getValue('line2'),
        postalCode: ctx.getValue('postalCode')
    };
}

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

function fromCto (ctx, dto) {
    this.addressKey = dto.addressKey;
    this.orderKey =   dto.orderKey;
    this.country =    dto.country;
    this.state =      dto.state;
    this.city =       dto.city;
    this.line1 =      dto.line1;
    this.line2 =      dto.line2;
    this.postalCode = dto.postalCode;
}

//endregion

var extensions = new Extensions('async-dal', __filename);
extensions.daoBuilder = daoBuilder;
extensions.toDto = toDto;
extensions.fromDto = fromDto;
extensions.toCto = toCto;
extensions.fromCto = fromCto;

var Address = bo.EditableModel(properties, rules, extensions);

module.exports = Address;
