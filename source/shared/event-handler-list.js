'use strict';

var EnsureArgument = require('../system/ensure-argument.js');
var DataPortalEvent = require('./data-portal-event.js');
var ModalBase = require('../model-base.js');
var CollectionBase = require('../collection-base.js');

var EventHandlerList = function () {

  var items = [];

  this.add = function (modelName, event, handler) {
    items.push({
      modelName: EnsureArgument.isMandatoryString(modelName,
          'm_manString', 'EventHandlerList', 'add', 'modelName'),
      event: EnsureArgument.isEnumMember(event, DataPortalEvent, null,
          'm_enumMember', 'EventHandlerList', 'add', 'event'),
      handler: EnsureArgument.isMandatoryFunction(handler,
          'm_manFunction', 'EventHandlerList', 'add', 'handler')
    });
  };

  this.setup = function (target) {
    target = EnsureArgument.isMandatoryType(target, [ ModalBase, CollectionBase ],
        'm_manType', 'EventHandlerList', 'setup', 'target');

    items.filter(function (item) {
      return item.modelName === target.$modelName;
    }).forEach(function (item) {
      target.on(DataPortalEvent.getName(item.event), item.handler)
    })
  };
};

module.exports = EventHandlerList;
