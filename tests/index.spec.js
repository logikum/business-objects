console.log('Testing index.js...');

var index = require('../source/index.js');

describe('Business object index', function() {

  it('returns correct data types', function() {

    expect(index.EditableRootModel).toEqual(jasmine.any(Function));
    expect(index.EditableChildModel).toEqual(jasmine.any(Function));
    expect(index.EditableChildCollection).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyRootModel).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyChildModel).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyRootCollection).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyChildCollection).toEqual(jasmine.any(Function));
    expect(index.CommandObject).toEqual(jasmine.any(Function));

    expect(index.EditableRootModelSync).toEqual(jasmine.any(Function));
    expect(index.EditableChildModelSync).toEqual(jasmine.any(Function));
    expect(index.EditableChildCollectionSync).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyRootModelSync).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyChildModelSync).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyRootCollectionSync).toEqual(jasmine.any(Function));
    expect(index.ReadOnlyChildCollectionSync).toEqual(jasmine.any(Function));
    expect(index.CommandObjectSync).toEqual(jasmine.any(Function));

    expect(index.dataTypes).toEqual(jasmine.any(Object));
    expect(index.commonRules).toEqual(jasmine.any(Object));
    expect(index.daoBuilder).toEqual(jasmine.any(Function));
    expect(index.shared).toEqual(jasmine.any(Object));
    expect(index.rules).toEqual(jasmine.any(Object));
  });
});
