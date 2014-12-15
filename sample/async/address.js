'use strict';

var bo = require('../../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var addressKey = new Property('addressKey', dt.Integer, false);
var country = new Property('country', dt.Text);
var city = new Property('city', dt.Text);
var line1 = new Property('line1', dt.Text);
var line2 = new Property('line2', dt.Text);
var postalCode = new Property('unitPrice', dt.Integer);

var properties = new Properties(
    'Address',
    addressKey,
    country,
    city,
    line1,
    line2,
    postalCode
);

var rules = new Rules(
    new cr.required(country),
    new cr.required(city),
    new cr.required(line1),
    new cr.required(postalCode)
);

var extensions = new Extensions('dao', __filename);

var Address = new bo.EditableModel(properties, rules, extensions);

module.exports = Address;
