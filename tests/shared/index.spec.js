console.log('Testing shared/index.js...');

var shared = require('../../source/shared/index.js');
var Text = require('../../source/data-types/text.js');

var ModelError = require('../../source/shared/model-error.js');
var ConfigurationError = require('../../source/shared/configuration-error.js');
var ExtensionManager = require('../../source/shared/extension-manager.js');
var ExtensionManagerSync = require('../../source/shared/extension-manager-sync.js');
var EventHandlerList = require('../../source/shared/event-handler-list.js');
var DataStore = require('../../source/shared/data-store.js');

var PropertyInfo = require('../../source/shared/property-info.js');
var PropertyFlag = require('../../source/shared/property-flag.js');
var PropertyManager = require('../../source/shared/property-manager.js');
var PropertyContext = require('../../source/shared/property-context.js');
var TransferContext = require('../../source/shared/transfer-context.js');

var DataPortalAction = require('../../source/shared/data-portal-action.js');
var DataPortalContext = require('../../source/shared/data-portal-context.js');
var DataPortalEvent = require('../../source/shared/data-portal-event.js');
var DataPortalEventArgs = require('../../source/shared/data-portal-event-args.js');
var DataPortalError = require('../../source/shared/data-portal-error.js');

describe('Shared component index', function () {
  var text = new Text();
  var dao = {};
  var data = 0;
  function getValue () {
    return data;
  }
  function setValue (value) {
    data = value;
  }

  it('properties return correct components', function() {

    expect(new shared.ModelError('message')).toEqual(jasmine.any(ModelError));
    expect(new shared.ConfigurationError('message')).toEqual(jasmine.any(ConfigurationError));
    expect(new shared.ExtensionManager('data_source', '/model/path')).toEqual(jasmine.any(ExtensionManager));
    expect(new shared.ExtensionManagerSync('data_source', '/model/path')).toEqual(jasmine.any(ExtensionManagerSync));
    expect(new shared.EventHandlerList()).toEqual(jasmine.any(EventHandlerList));
    expect(new shared.DataStore()).toEqual(jasmine.any(DataStore));

    expect(new shared.PropertyInfo('property', text)).toEqual(jasmine.any(PropertyInfo));
    expect(shared.PropertyFlag).toBe(PropertyFlag);
    expect(new shared.PropertyManager('list')).toEqual(jasmine.any(PropertyManager));
    expect(new shared.PropertyContext([], getValue, setValue)).toEqual(jasmine.any(PropertyContext));
    expect(new shared.TransferContext([], getValue, setValue)).toEqual(jasmine.any(TransferContext));

    expect(shared.DataPortalAction).toBe(DataPortalAction);
    expect(new shared.DataPortalContext(dao, [], getValue, setValue)).toEqual(jasmine.any(DataPortalContext));
    expect(shared.DataPortalEvent).toBe(DataPortalEvent);
    expect(new shared.DataPortalEventArgs(DataPortalEvent.preCreate, 'model')).toEqual(jasmine.any(DataPortalEventArgs));
    expect(new shared.DataPortalError('type', 'name', 0, {})).toEqual(jasmine.any(DataPortalError));
  });
});
