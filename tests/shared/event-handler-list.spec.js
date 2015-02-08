console.log('Testing shared/event-handler-list.js...');

var util = require('util');
var EventHandlerList = require('../../source/shared/event-handler-list.js');
var ModelBase = require('../../source/model-base.js');
var DataPortalEventArgs = require('../../source/shared/data-portal-event-args.js');
var DataPortalEvent = require('../../source/shared/data-portal-event.js');

describe('Event handler list', function () {

  it('constructor expects no arguments', function () {
    var build01 = function () { return new EventHandlerList(); };

    expect(build01).not.toThrow();
  });

  it('add and setup methods work', function () {
    var result = '';

    var Model = function (eventhandlers) {
      var self = this;
      this.$modelName = 'model';
      eventhandlers.setup(self);
      this.emit('postCreate', new DataPortalEventArgs(DataPortalEvent.postCreate, self.$modelName), self);
    };
    util.inherits(Model, ModelBase);

    function ehCreated (eventArgs, model) {
      result = 'Event ' + eventArgs.modelName + '.' + eventArgs.eventName + ': Model has been created.';
    }
    var ehl = new EventHandlerList();
    ehl.add('model', DataPortalEvent.postCreate, ehCreated);
    var model = new Model(ehl);

    expect(result).toBe('Event model.postCreate: Model has been created.');
  });

});
