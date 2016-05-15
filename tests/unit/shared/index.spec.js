console.log('Testing shared/index.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var shared = read( 'shared/index.js');
var Text = read( 'data-types/text.js');

var ExtensionManager = read( 'shared/extension-manager.js');
var EventHandlerList = read( 'shared/event-handler-list.js');
var DataStore = read( 'shared/data-store.js');
//var ModelState = read( 'shared/model-state.js');
var ModelError = read( 'shared/model-error.js');

var PropertyInfo = read( 'shared/property-info.js');
var PropertyFlag = read( 'shared/property-flag.js');
var PropertyManager = read( 'shared/property-manager.js');
var PropertyContext = read( 'shared/property-context.js');
var TransferContext = read( 'shared/transfer-context.js');

var DataPortalAction = read( 'shared/data-portal-action.js');
var DataPortalContext = read( 'shared/data-portal-context.js');
var DataPortalEvent = read( 'shared/data-portal-event.js');
var DataPortalEventArgs = read( 'shared/data-portal-event-args.js');
var DataPortalError = read( 'shared/data-portal-error.js');

var Enumeration = read( 'system/enumeration.js');

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

    expect(new shared.ExtensionManager('data_source', '/model/path')).toEqual(jasmine.any(ExtensionManager));
    expect(new shared.EventHandlerList()).toEqual(jasmine.any(EventHandlerList));
    expect(new shared.DataStore()).toEqual(jasmine.any(DataStore));
    expect(shared.ModelState).toEqual(jasmine.any(Enumeration));
    expect(new shared.ModelError('message')).toEqual(jasmine.any(ModelError));

    expect(new shared.PropertyInfo('property', text)).toEqual(jasmine.any(PropertyInfo));
    expect(shared.PropertyFlag).toBe(PropertyFlag);
    expect(new shared.PropertyManager()).toEqual(jasmine.any(PropertyManager));
    expect(new shared.PropertyContext('model', [], getValue, setValue)).toEqual(jasmine.any(PropertyContext));
    expect(new shared.TransferContext([], getValue, setValue)).toEqual(jasmine.any(TransferContext));

    expect(shared.DataPortalAction).toBe(DataPortalAction);
    expect(new shared.DataPortalContext(dao, [], getValue, setValue)).toEqual(jasmine.any(DataPortalContext));
    expect(shared.DataPortalEvent).toBe(DataPortalEvent);
    expect(new shared.DataPortalEventArgs(DataPortalEvent.preCreate, 'model')).toEqual(jasmine.any(DataPortalEventArgs));
    expect(new shared.DataPortalError('type', 'name', 0, {})).toEqual(jasmine.any(DataPortalError));
  });
});
