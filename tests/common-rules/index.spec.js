console.log('Testing common-rules/index.js...');

var cr = require('../../source/common-rules/index.js');

var PropertyInfo = require('../../source/shared/property-info.js');
var Text = require('../../source/data-types/text.js');
var AuthorizationAction = require('../../source/rules/authorization-action.js');

var IsInRoleRule = require('../../source/common-rules/is-in-role-rule.js');
var IsNotInRoleRule = require('../../source/common-rules/is-not-in-role-rule.js');

var RequiredRule = require('../../source/common-rules/required-rule.js');
var MaxLengthRule = require('../../source/common-rules/max-length-rule.js');
var MinLengthRule = require('../../source/common-rules/min-length-rule.js');
var LengthIsRule = require('../../source/common-rules/length-is-rule.js');
var MaxValueRule = require('../../source/common-rules/max-value-rule.js');
var MinValueRule = require('../../source/common-rules/min-value-rule.js');
var ExpressionRule = require('../../source/common-rules/expression-rule.js');
var DependencyRule = require('../../source/common-rules/dependency-rule.js');
var InformationRule = require('../../source/common-rules/information-rule.js');
var NullResultOption = require('../../source/common-rules/null-result-option.js');

describe('Common rule index', function() {
  var pi = new PropertyInfo('property', new Text(), true);
  var di = new PropertyInfo('dependent', new Text());
  var re = new RegExp('[-+]?[0-9]*\.?[0-9]+', 'g');

  it('properties return correct rules', function() {

    expect(cr.isInRole(AuthorizationAction.createObject, null, 'developers')).toEqual(jasmine.any(IsInRoleRule));
    expect(cr.isNotInRole(AuthorizationAction.removeObject, null, 'developers')).toEqual(jasmine.any(IsNotInRoleRule));

    expect(cr.required(pi)).toEqual(jasmine.any(RequiredRule));
    expect(cr.maxLength(pi, 64)).toEqual(jasmine.any(MaxLengthRule));
    expect(cr.minLength(pi, 16)).toEqual(jasmine.any(MinLengthRule));
    expect(cr.lengthIs(pi, 32)).toEqual(jasmine.any(LengthIsRule));
    expect(cr.maxValue(pi, 'z')).toEqual(jasmine.any(MaxValueRule));
    expect(cr.minValue(pi, 'A')).toEqual(jasmine.any(MinValueRule));
    expect(cr.expression(pi, re, NullResultOption.returnFalse)).toEqual(jasmine.any(ExpressionRule));
    expect(cr.dependency(pi, di)).toEqual(jasmine.any(DependencyRule));
    expect(cr.information(pi, 'message')).toEqual(jasmine.any(InformationRule));

    expect(cr.nullResultOption).toEqual(jasmine.any(Object));
  });
});
