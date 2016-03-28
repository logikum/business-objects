console.log('Testing index.js...');

var bo = require('../../source/index.js');

describe('Business object index', function() {

  it('returns correct data types', function() {

    expect(bo.ModelComposer).toEqual(jasmine.any(Function));
    expect(bo.ModelComposerSync).toEqual(jasmine.any(Function));

    expect(bo.EditableRootModel).toEqual(jasmine.any(Function));
    expect(bo.EditableChildModel).toEqual(jasmine.any(Function));
    expect(bo.EditableChildCollection).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootModel).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildModel).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootCollection).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildCollection).toEqual(jasmine.any(Function));
    expect(bo.CommandObject).toEqual(jasmine.any(Function));

    expect(bo.EditableRootModelSync).toEqual(jasmine.any(Function));
    expect(bo.EditableChildModelSync).toEqual(jasmine.any(Function));
    expect(bo.EditableChildCollectionSync).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyRootModelSync).toEqual(jasmine.any(Function));
    expect(bo.ReadOnlyChildModelSync).toEqual(jasmine.any(Function));
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
