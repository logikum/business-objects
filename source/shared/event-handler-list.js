'use strict';

var CLASS_NAME = 'EventHandlerList';

var Argument = require('../system/argument-check.js');
var DataPortalEvent = require('./data-portal-event.js');
var ModalBase = require('../model-base.js');
var CollectionBase = require('../collection-base.js');

/**
 * @classdesc Provides methods to manage the event handlers of a business object instance.
 * @description Creates a new event handler list object.
 *
 * @memberof bo.shared
 * @constructor
 */
var EventHandlerList = function () {

  var items = [];

  /**
   * Adds a new event handler to to list.
   *
   * @param {string} modelName - The name of the business object model.
   * @param {bo.shared.DataPortalEvent} event - The event to listen.
   * @param {external.eventHandler} handler - A function to be invoked when the event is emitted.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The event must be a DataPortalEvent member.
   * @throws {@link bo.system.ArgumentError Argument error}: The handler must be a function.
   */
  this.add = function (modelName, event, handler) {
    var check = Argument.inMethod(CLASS_NAME, 'add');
    items.push({
      modelName: check(modelName).forMandatory('modelName').asString(),
      event: check(event).for('event').asEnumMember(DataPortalEvent, null),
      handler: check(handler).forMandatory('handler').asFunction()
    });
  };

  /**
   * Adds the event handlers with the model name of the target object
   * to the target object for all events. This method is called by models
   * internally to set up the event handlers.
   *
   * @protected
   * @param {bo.ModalBase|bo.CollectionBase} target - A business object instance.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   */
  this.setup = function (target) {
    target = Argument.inMethod(CLASS_NAME, 'setup')
        .check(target).forMandatory('target').asType([ ModalBase, CollectionBase ]);

    items.filter(function (item) {
      return item.modelName === target.$modelName;
    }).forEach(function (item) {
      target.on(DataPortalEvent.getName(item.event), item.handler)
    })
  };
};

module.exports = EventHandlerList;
