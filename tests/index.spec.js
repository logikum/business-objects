console.log('Testing index.js...');

var index = require('../source/index.js');

describe('Business object index', function() {

  it('returns correct data types', function() {

    expect(index.EditableModel).toEqual(jasmine.any(Function));
    expect(index.EditableCollection).toEqual(jasmine.any(Function));

    expect(index.EditableModelSync).toEqual(jasmine.any(Function));
    expect(index.EditableCollectionSync).toEqual(jasmine.any(Function));

    expect(index.dataTypes).toEqual(jasmine.any(Object));
    expect(index.commonRules).toEqual(jasmine.any(Object));
    expect(index.daoBuilder).toEqual(jasmine.any(Function));
    expect(index.shared).toEqual(jasmine.any(Object));
    expect(index.rules).toEqual(jasmine.any(Object));
  });
});
