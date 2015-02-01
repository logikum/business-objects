'use strict';

var config = require('./configuration-reader.js');
var DataPortalAction = require('./data-portal-action.js');

function DataPortalEventArgs (modelName, action, methodName, error) {

  this.modelName = modelName;
  this.action = action;
  this.methodName = methodName || DataPortalAction.getName(action);
  this.error = error || null;
  this.user = config.getUser();
  this.locale = config.getLocale();

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataPortalEventArgs;
