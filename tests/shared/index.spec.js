console.log('Testing shared/index.js...');

var shared = require('../../source/shared/index.js');
var Text = require('../../source/data-types/text.js');
var UserReader = require('../../sample/get-user.js');

var PropertyInfo = require('../../source/shared/property-info.js');
var PropertyManager = require('../../source/shared/property-manager.js');
var PropertyContext = require('../../source/shared/property-context.js');
var ExtensionManager = require('../../source/shared/extension-manager.js');
var ExtensionManagerSync = require('../../source/shared/extension-manager-sync.js');

var UserInfo = require('../../source/shared/user-info.js');
var DataPortalContext = require('../../source/shared/data-portal-context.js');
var TransferContext = require('../../source/shared/transfer-context.js');

//var configuration = require('../../source/shared/configuration-reader.js');
var EnsureArgument = require('../../source/shared/ensure-argument.js');
var Enumeration = require('../../source/shared/enumeration.js');
//var PropertyFlag = require('../../source/shared/property-flag.js');

var ArgumentError = require('../../source/shared/argument-error.js');
var ConfigurationError = require('../../source/shared/configuration-error.js');
var DataPortalError = require('../../source/shared/data-portal-error.js');
var EnumerationError = require('../../source/shared/enumeration-error.js');
var ModelError = require('../../source/shared/model-error.js');
var NotImplementedError = require('../../source/shared/not-implemented-error.js');

describe('Shared component index', function () {
  var dao = {};
  var data = 0;
  function getValue () {
    return data;
  }
  function setValue (value) {
    data = value;
  }

  it('properties return correct components', function() {

    expect(new shared.PropertyInfo('property', new Text())).toEqual(jasmine.any(PropertyInfo));
    expect(new shared.PropertyManager('list')).toEqual(jasmine.any(PropertyManager));
    expect(new shared.PropertyContext([], getValue, setValue)).toEqual(jasmine.any(PropertyContext));
    expect(new shared.ExtensionManager('data_source', '/model/path')).toEqual(jasmine.any(ExtensionManager));
    expect(new shared.ExtensionManagerSync('data_source', '/model/path')).toEqual(jasmine.any(ExtensionManagerSync));

    expect(new shared.UserInfo('anonymous')).toEqual(jasmine.any(UserInfo));
    expect(new shared.DataPortalContext(dao, [], getValue, setValue)).toEqual(jasmine.any(DataPortalContext));
    expect(new shared.TransferContext([], getValue, setValue)).toEqual(jasmine.any(TransferContext));

    expect(shared.getConfiguration()).toEqual(jasmine.any(Object));
    expect(shared.EnsureArgument).toEqual(EnsureArgument);
    expect(new shared.Enumeration('item')).toEqual(jasmine.any(Enumeration));
    expect(shared.PropertyFlag).toEqual(jasmine.any(Object));

    expect(new shared.ArgumentError('message')).toEqual(jasmine.any(ArgumentError));
    expect(new shared.ConfigurationError('message')).toEqual(jasmine.any(ConfigurationError));
    expect(new shared.DataPortalError('type', 'name', 'action', {})).toEqual(jasmine.any(DataPortalError));
    expect(new shared.EnumerationError('message')).toEqual(jasmine.any(EnumerationError));
    expect(new shared.ModelError('message')).toEqual(jasmine.any(ModelError));
    expect(new shared.NotImplementedError('message')).toEqual(jasmine.any(NotImplementedError));
  });
});
