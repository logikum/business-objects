console.log('Testing rules/validation-error.js...');

var ValidationError = require('../../source/rules/validation-error.js');
var BrokenRules = require('../../source/rules/broken-rule-response.js');
var RuleSeverity = require('../../source/rules/rule-severity.js');

describe('Validation error', function () {
  var brs = new BrokenRules();
  brs.add('property', 'message #1', RuleSeverity.information);
  brs.add('property', 'message #2', RuleSeverity.error);

  it('constructor expects one or two arguments', function () {
    var build01 = function () { return new ValidationError(); };
    var build02 = function () { return new ValidationError({}); };
    var build03 = function () { return new ValidationError(brs); };
    var build04 = function () { return new ValidationError(brs, 2); };
    var build05 = function () { return new ValidationError(brs, 'Something is wrong.'); };

    expect(build01).toThrow();
    expect(build02).toThrow();
    expect(build03).not.toThrow();
    expect(build04).toThrow();
    expect(build05).not.toThrow();
  });

  it('has five properties', function() {
    var ve = new ValidationError(brs, 'Something is wrong.');

    expect(ve.name).toBe('ValidationError');
    expect(ve.status).toBe(422);
    expect(ve.message).toBe('Something is wrong.');
    expect(ve.data).toEqual(jasmine.any(Object));
    expect(ve.data.property).toEqual(jasmine.any(Array));
    expect(ve.data.property.length).toBe(1);
    expect(ve.data.property[0].message).toBe('message #2');
    expect(ve.data.property[0].severity).toBe(RuleSeverity.error);
    expect(ve.count).toBe(1);
  });

  it('has read.only properties', function() {
    var ve = new ValidationError(brs, 'Something is wrong.');
    ve.name = 'name';
    ve.status = 404;
    ve.message = 'Good bye!';
    ve.data = { first: true, second : 2 };
    ve.count = 33;

    expect(ve.name).toBe('ValidationError');
    expect(ve.status).toBe(422);
    expect(ve.message).toBe('Something is wrong.');
    expect(ve.data).toEqual(jasmine.any(Object));
    expect(ve.data.property).toEqual(jasmine.any(Array));
    expect(ve.data.property.length).toBe(1);
    expect(ve.data.property[0].message).toBe('message #2');
    expect(ve.data.property[0].severity).toBe(RuleSeverity.error);
    expect(ve.count).toBe(1);
  });
});
