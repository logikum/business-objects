'use strict';

const bo = require( '../../source/index.js' );

const Properties = bo.shared.PropertyManager;
const Rules = bo.rules.RuleManager;
const Action = bo.rules.AuthorizationAction;
const Extensions = bo.shared.ExtensionManager;
const Property = bo.shared.PropertyInfo;
//const F = bo.shared.PropertyFlag;
const dt = bo.dataTypes;
const cr = bo.commonRules;

const orderKey = new Property( 'orderKey', dt.Integer );
const orderItemKey = new Property( 'orderItemKey', dt.Integer );
const orderScheduleKey = new Property( 'orderScheduleKey', dt.Integer );
const result = new Property( 'result', dt.Boolean );

const properties = new Properties(
  orderKey,
  orderItemKey,
  orderScheduleKey,
  result
);

const rules = new Rules(
  cr.required( orderKey ),
  cr.required( orderItemKey ),
  cr.required( orderScheduleKey ),
  cr.isInRole( Action.executeCommand, null, 'administrators', 'You are not authorized to execute the command.' )
);

const extensions = new Extensions( 'dao', __filename );

const ClearScheduleCommand = bo.CommandObject( 'ClearScheduleCommand', properties, rules, extensions );

module.exports = ClearScheduleCommand;
