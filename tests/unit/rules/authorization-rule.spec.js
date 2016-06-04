console.log( 'Testing main.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const AuthorizationRule = read( 'rules/authorization-rule.js' );
const RuleBase = read( 'rules/rule-base.js' );
const AuthorizationAction = read( 'rules/authorization-action.js' );
const AuthorizationResult = read( 'rules/authorization-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const NoAccessBehavior = read( 'rules/no-access-behavior.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );

describe( 'Authorization rule', () => {

  it( 'constructor expects a non-empty string argument', () => {

    const build01 = function () { return new AuthorizationRule(); };
    const build02 = function () { return new AuthorizationRule( null ); };
    const build03 = function () { return new AuthorizationRule( '' ); };
    const build04 = function () { return new AuthorizationRule( 'ruleName' ); };
    const build05 = function () { return new AuthorizationRule( true ); };
    const build06 = function () { return new AuthorizationRule( 777 ); };
    const build07 = function () { return new AuthorizationRule( {} ); };
    const build08 = function () { return new AuthorizationRule( [ 'ruleName' ] ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
  } );

  it( 'inherits rule base type', () => {

    const rule = new AuthorizationRule( 'ruleName' );

    expect( rule ).toEqual( jasmine.any( RuleBase ) );
  } );

  it( 'has six properties', () => {

    const rule = new AuthorizationRule( 'ruleName' );

    expect( rule.ruleName ).toBe( 'ruleName' );
    expect( rule.ruleId ).toBeNull();
    expect( rule.noAccessBehavior ).toBe( NoAccessBehavior.throwError );
    expect( rule.message ).toBeNull();
    expect( rule.priority ).toBe( 10 );
    expect( rule.stopsProcessing ).toBe( false );
  } );

  it( 'initialize method works', () => {

    const property = new PropertyInfo( 'property', new Text() );
    const rule1 = new AuthorizationRule( 'ruleName #1' );
    rule1.initialize( AuthorizationAction.readProperty, property, 'message #1', 19, true );
    const rule2 = new AuthorizationRule( 'ruleName #2' );
    rule2.initialize( AuthorizationAction.executeMethod, 'getByName', 'message #2', 17, false );
    const rule3 = new AuthorizationRule( 'ruleName #3' );
    rule3.initialize( AuthorizationAction.updateObject, null, 'message #3', 13, true );

    expect( rule1.ruleName ).toBe( 'ruleName #1' );
    expect( rule1.ruleId ).toBe( 'readProperty.property' );
    expect( rule1.message ).toBe( 'message #1' );
    expect( rule1.priority ).toBe( 19 );
    expect( rule1.stopsProcessing ).toBe( true );

    expect( rule2.ruleName ).toBe( 'ruleName #2' );
    expect( rule2.ruleId ).toBe( 'executeMethod.getByName' );
    expect( rule2.message ).toBe( 'message #2' );
    expect( rule2.priority ).toBe( 17 );
    expect( rule2.stopsProcessing ).toBe( false );

    expect( rule3.ruleName ).toBe( 'ruleName #3' );
    expect( rule3.ruleId ).toBe( 'updateObject' );
    expect( rule3.message ).toBe( 'message #3' );
    expect( rule3.priority ).toBe( 13 );
    expect( rule3.stopsProcessing ).toBe( true );
  } );

  it( 'result method works', () => {

    const property = new PropertyInfo( 'property', new Text() );
    const rule1 = new AuthorizationRule( 'ruleName #1' );
    rule1.initialize( AuthorizationAction.readProperty, property, 'message #1', 19, true );
    //const result = rule1.result('final message', RuleSeverity.warning);
    const result1 = function () { return rule1.result( 'final message', RuleSeverity.warning ); };

    const rule2 = new AuthorizationRule( 'ruleName #2' );
    rule2.initialize( AuthorizationAction.updateObject, null, 'message #2', 13, true );
    rule2.noAccessBehavior = NoAccessBehavior.showError;
    const result2 = rule2.result();

    expect( result1 ).toThrow( 'final message' );

    expect( result2 ).toEqual( jasmine.any( AuthorizationResult ) );
    expect( result2.ruleName ).toBe( 'ruleName #2' );
    expect( result2.propertyName ).toBe( '' );
    expect( result2.message ).toBe( 'message #2' );
    expect( result2.severity ).toBe( RuleSeverity.error );
    expect( result2.stopsProcessing ).toBe( true );
    expect( result2.isPreserved ).toBe( true );
  } );
} );
