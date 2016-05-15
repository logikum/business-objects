console.log('Testing rules/index.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const rules = read( 'rules/index.js' );

const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationContext = read( 'rules/validation-context.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const DataTypeRule = read( 'rules/data-type-rule.js' );

const AuthorizationRule = read( 'rules/authorization-rule.js' );
const AuthorizationContext = read( 'rules/authorization-context.js' );
const AuthorizationResult = read( 'rules/authorization-result.js' );
const AuthorizationError = read( 'rules/authorization-error.js' );
const AuthorizationAction = read( 'rules/authorization-action.js' );
//const NoAccessBehavior = require(SRC + 'rules/no-access-behavior.js');

const RuleManager = read( 'rules/rule-manager.js' );
const RuleList = read( 'rules/rule-list.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const RuleBase = read( 'rules/rule-base.js' );
const ResultBase = read( 'rules/result-base.js' );

const BrokenRuleList = read( 'rules/broken-rule-list.js' );
const BrokenRule = read( 'rules/broken-rule.js' );
const RuleNotice = read( 'rules/rule-notice.js' );
const BrokenRulesOutput = read( 'rules/broken-rules-output.js' );
const BrokenRulesResponse = read( 'rules/broken-rules-response.js' );

const Text = read( 'data-types/text.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const DataStore = read( 'shared/data-store.js' );
const Enumeration = read( 'system/enumeration.js' );

describe( 'Rule component index', () => {

  const rule = new RuleBase( 'required' );
  const brokenRules = new BrokenRuleList( 'modelName' );
  const bro = new BrokenRulesOutput();
  const pi = new PropertyInfo( 'property', new Text() );

  it( 'properties return correct components', () => {

    expect( new rules.ValidationRule( 'ruleName' ) ).toEqual( jasmine.any( ValidationRule ) );
    expect( new rules.ValidationContext( new DataStore(), brokenRules ) ).toEqual( jasmine.any( ValidationContext ) );
    expect( new rules.ValidationResult( 'ruleName', 'propertyName', 'message' ) ).toEqual( jasmine.any( ValidationResult ) );
    expect( new rules.DataTypeRule( pi ) ).toEqual( jasmine.any( DataTypeRule ) );

    expect( new rules.AuthorizationRule( 'ruleName' ) ).toEqual( jasmine.any( AuthorizationRule ) );
    expect( new rules.AuthorizationContext( AuthorizationAction.writeProperty, 'property', brokenRules ) ).toEqual( jasmine.any( AuthorizationContext ) );
    expect( new rules.AuthorizationResult( 'ruleName', 'propertyName', 'message' ) ).toEqual( jasmine.any( AuthorizationResult ) );
    expect( new rules.AuthorizationError() ).toEqual( jasmine.any( AuthorizationError ) );
    expect( rules.AuthorizationAction ).toEqual( jasmine.any( Enumeration ) );
    expect( rules.NoAccessBehavior ).toEqual( jasmine.any( Enumeration ) );

    expect( new rules.RuleManager() ).toEqual( jasmine.any( RuleManager ) );
    expect( new rules.RuleList( 'property', rule ) ).toEqual( jasmine.any( RuleList ) );
    expect( rules.RuleSeverity ).toEqual( jasmine.any( Enumeration ) );
    expect( new rules.RuleBase( 'memberOf' ) ).toEqual( jasmine.any( RuleBase ) );
    expect( new rules.ResultBase( 'rule', '', 'message' ) ).toEqual( jasmine.any( ResultBase ) );

    expect( new rules.BrokenRuleList( 'model' ) ).toEqual( jasmine.any( BrokenRuleList ) );
    expect( new rules.BrokenRule( 'name', false, 'property', 'message', RuleSeverity.error ) ).toEqual( jasmine.any( BrokenRule ) );
    expect( new rules.RuleNotice( 'bad', RuleSeverity.error ) ).toEqual( jasmine.any( RuleNotice ) );
    expect( new rules.BrokenRulesOutput() ).toEqual( jasmine.any( BrokenRulesOutput ) );
    expect( new rules.BrokenRulesResponse( bro ) ).toEqual( jasmine.any( BrokenRulesResponse ) );
  } );
} );
