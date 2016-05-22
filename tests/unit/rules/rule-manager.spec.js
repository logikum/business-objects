console.log( 'Testing rules/rule-manager.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const RuleManager = read( 'rules/rule-manager.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationContext = read( 'rules/validation-context.js' );
const AuthorizationRule = read( 'rules/authorization-rule.js' );
const AuthorizationContext = read( 'rules/authorization-context.js' );
const AuthorizationAction = read( 'rules/authorization-action.js' );
const NoAccessBehavior = read( 'rules/no-access-behavior.js' );
const BrokenRuleList = read( 'rules/broken-rule-list.js' );
const Text = read( 'data-types/text.js' );
const DataStore = read( 'shared/data-store.js' );
const PropertyInfo = read( 'shared/property-info.js' );

describe( 'Rule manager', () => {

  const vr0 = new ValidationRule( 'ruleName' );
  const ar0 = new AuthorizationRule( 'ruleName' );

  const vr = new ValidationRule( 'ruleName' );
  const property = new PropertyInfo( 'property', new Text() );
  vr.initialize( property, 'message', 19, true );

  const ar = new AuthorizationRule( 'ruleName' );
  ar.initialize( AuthorizationAction.updateObject, null, 'message', 13, true );

  it( 'constructor expects any rule argument', () => {

    const build01 = function () { return new RuleManager(); };
    const build02 = function () { return new RuleManager( 1 ); };
    const build03 = function () { return new RuleManager( true ); };
    const build04 = function () { return new RuleManager( 'rules' ); };
    const build05 = function () { return new RuleManager( 11.11 ); };
    const build06 = function () { return new RuleManager( {} ); };
    const build07 = function () { return new RuleManager( [] ); };
    const build08 = function () { return new RuleManager( vr0 ); };
    const build09 = function () { return new RuleManager( ar0 ); };
    const build10 = function () { return new RuleManager( vr ); };
    const build11 = function () { return new RuleManager( ar ); };
    const build12 = function () { return new RuleManager( vr, ar ); };

    expect( build01 ).not.toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
    expect( build09 ).toThrow();
    expect( build10 ).not.toThrow();
    expect( build11 ).not.toThrow();
    expect( build12 ).not.toThrow();
  } );

  it( 'initialize method works', () => {

    const rm = new RuleManager( vr, ar );
    rm.initialize( NoAccessBehavior.throwError );

    expect( rm.noAccessBehavior ).toBe( NoAccessBehavior.throwError );
  } );

  it( 'add method works', () => {

    const rm = new RuleManager();
    rm.initialize( NoAccessBehavior.throwError );

    const add01 = function () { rm.add(); };
    const add02 = function () { rm.add( {} ); };
    const add03 = function () { rm.add( vr0 ); };
    const add04 = function () { rm.add( ar0 ); };
    const add05 = function () { rm.add( vr ); };
    const add06 = function () { rm.add( ar ); };
    const add07 = function () { rm.add( [ vr, ar ] ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).toThrow();
    expect( add05 ).not.toThrow();
    expect( add06 ).not.toThrow();
    expect( add07 ).toThrow();
  } );

  it( 'validate method works', () => {

    const rm = new RuleManager( vr );
    rm.initialize( NoAccessBehavior.throwError );

    const brokenRules = new BrokenRuleList( 'modelName' );
    const context = new ValidationContext( new DataStore(), brokenRules );

    const validate01 = function () { rm.validate( property, context ); };

    expect( validate01 ).toThrow( 'The ValidationRule.execute method is not implemented.' );
  } );

  it( 'hasPermission method works', () => {

    const rm = new RuleManager( ar );
    rm.initialize( NoAccessBehavior.throwError );

    const brokenRules = new BrokenRuleList( 'modelName' );
    const context = new AuthorizationContext( AuthorizationAction.updateObject, '', brokenRules );

    const hasPermission01 = function () {
      rm.hasPermission( context );
    };

    expect( hasPermission01 ).toThrow( 'The AuthorizationRule.execute method is not implemented.' );
  } );
} );
