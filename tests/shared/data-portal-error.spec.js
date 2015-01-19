console.log('Testing shared/data-portal-error.js...');

var DataPortalError = require('../../source/shared/data-portal-error.js');

describe('Data portal error', function() {

  it('constructor expects three-four arguments', function() {
    function build01() { var options = new DataPortalError(); }
    function build02() { var options = new DataPortalError(1, 2, 3); }
    function build03() { var options = new DataPortalError('first', 'second', 3); }
    function build04() { var options = new DataPortalError('first', 2, 'third'); }
    function build05() { var options = new DataPortalError(1, 'second', 'third'); }
    function build06() { var options = new DataPortalError('first', 'second', 'third'); }
    function build07() { var options = new DataPortalError('first', 'second', 'third', {}); }
    function build08() { var options = new DataPortalError('first', 'second', 'third', {error:'description'}); }

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
    var dpe = new DataPortalError('Model type', 'ModelName', 'execute', ie);

    expect(dpe).toEqual(jasmine.any(Error));
    expect(dpe.name).toBe('DataPortalError');
    expect(dpe.modelType).toBe('Model type');
    expect(dpe.modelName).toBe('ModelName');
    expect(dpe.action).toBe('execute');
    expect(dpe.message).toBe('Executing ModelName has failed.');
    expect(dpe.innerError).toBe(ie);
  });
});
