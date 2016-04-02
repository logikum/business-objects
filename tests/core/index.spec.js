console.log('Testing index.js...');

var bo = require('../../source/index.js');

describe('Business object index', function() {

  it('returns correct data types', function() {

    expect(bo.ModelComposer).toEqual(jasmine.any(Function));
    expect(bo.ModelComposerSync).toEqual(jasmine.any(Function));

    expect(bo.EditableRootObject).toEqual(jasmine.any(Function));
    expect(bo.EditableChildObject).toEqual(jasmine.any(Function));
    expect(bo.EditableChildCollection).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootObject).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildObject).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootCollection).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildCollection).toEqual(jasmine.any(Function));
    expect(bo.CommandObject).toEqual(jasmine.any(Function));

    expect(bo.EditableRootObjectSync).toEqual(jasmine.any(Function));
    expect(bo.EditableChildObjectSync).toEqual(jasmine.any(Function));
    expect(bo.EditableChildCollectionSync).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootObjectSync).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildObjectSync).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootCollectionSync).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildCollectionSync).toEqual(jasmine.any(Function));
    expect(bo.CommandObjectSync).toEqual(jasmine.any(Function));

    expect(bo.commonRules).toEqual(jasmine.any(Object));
    expect(bo.dataAccess).toEqual(jasmine.any(Object));
    expect(bo.dataTypes).toEqual(jasmine.any(Object));
    expect(bo.rules).toEqual(jasmine.any(Object));
    expect(bo.shared).toEqual(jasmine.any(Object));
    expect(bo.system).toEqual(jasmine.any(Object));

    expect(bo.configuration).toEqual(jasmine.any(Object));
    expect(bo.i18n).toEqual(jasmine.any(Function));
  });
});
