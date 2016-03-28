console.log('Testing shared/model-error.js...');

var ArgumentError = require('../../../source/shared/model-error.js');

describe('Model error', function() {

  it('constructor expects an optional message', function() {
    var me1 = new ArgumentError();
    var me2 = new ArgumentError('The model definition is bad.');

    expect(me1).toEqual(jasmine.any(Error));
    expect(me1.name).toBe('ModelError');
    expect(me1.message).toBe('An error occurred in the model.');

    expect(me2).toEqual(jasmine.any(Error));
    expect(me2.name).toBe('ModelError');
    expect(me2.message).toBe('The model definition is bad.');
  });
});
