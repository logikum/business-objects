console.log('Testing shared/data-portal-error.js...');

var DataPortalError = require('../../../source/shared/data-portal-error.js');
var DataPortalAction = require('../../../source/shared/data-portal-action.js');

describe('Data portal error', function() {

  it('constructor expects three-four arguments', function() {
    function build01() { var err = new DataPortalError(); }
    function build02() { var err = new DataPortalError(1, 2, 3); }
    function build03() { var err = new DataPortalError('type', 'model', true); }
    function build04() { var err = new DataPortalError('type', {}, 'action'); }
    function build05() { var err = new DataPortalError([], 'model', 'action'); }
    function build06() { var err = new DataPortalError('type', 'model', DataPortalAction.fetch); }
    function build07() { var err = new DataPortalError('type', 'model', DataPortalAction.create, {}); }
    function build08() { var err = new DataPortalError('type', 'model', DataPortalAction.remove, {error:'description'}); }

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).toThrow();
    expect(build04).toThrow();
    expect(build05).toThrow();
    expect(build06).not.toThrow();
    expect(build07).not.toThrow();
    expect(build08).not.toThrow();
  });

  it('has six properties', function() {
    var ie = new Error('Intercepted error');
    var dpe = new DataPortalError('Model type', 'ModelName', DataPortalAction.execute, ie);

    expect(dpe).toEqual(jasmine.any(Error));
    expect(dpe.name).toBe('DataPortalError');
    expect(dpe.modelType).toBe('Model type');
    expect(dpe.modelName).toBe('ModelName');
    expect(dpe.action).toBe('execute');
    expect(dpe.message).toBe('Executing ModelName has failed.');
    expect(dpe.innerError).toBe(ie);
  });
});
