'use strict';

var bo = require('../../../source/index.js');

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

var extensions = new Extensions('dao', __filename);

var Address = bo.EditableChildObject('Address', properties, rules, extensions);

module.exports = Address;
