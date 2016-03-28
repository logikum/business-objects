'use strict';

var bo = require('../source/index.js');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Extensions = bo.shared.ExtensionManagerSync;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;

var key = new Property('key', dt.Integer, F.key | F.readOnly);
var description = new Property('description', dt.Text);

var properties = new Properties(
    'Widget',
    key,
    description
);

var rules = new Rules(
    cr.required(key)
);

var extensions = new Extensions('dao', __filename);

var Widget = bo.CommandObjectSync(properties, rules, extensions);

module.exports = Widget;
