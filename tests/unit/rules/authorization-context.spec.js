console.log( 'Testing rules/authorization-context.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const AuthorizationContext = read( 'rules/authorization-context.js' );
const AuthorizationAction = read( 'rules/authorization-action.js' );
const BrokenRuleList = read( 'rules/broken-rule-list.js' );
const UserInfo = read( 'system/user-info.js' );

describe( 'Authorization context', () => {

  const user = new UserInfo( 'user-code' );
  const brokenRules = new BrokenRuleList( 'modelName' );

  it( 'constructor expects three arguments', () => {

    const build01 = function () {
      return new AuthorizationContext();
    };
    const build02 = function () {
      return new AuthorizationContext( AuthorizationAction.writeProperty );
    };
    const build03 = function () {
      return new AuthorizationContext( AuthorizationAction.writeProperty, 'property' );
    };
    const build04 = function () {
      return new AuthorizationContext( AuthorizationAction.writeProperty, 'property', brokenRules );
    };
    const build05 = function () {
      return new AuthorizationContext( AuthorizationAction.writeProperty, '', brokenRules );
    };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).not.toThrow();
  } );

  it( 'has four properties', () => {

    const ctx = new AuthorizationContext( AuthorizationAction.writeProperty, 'property', brokenRules );

    expect( ctx.brokenRules ).toBe( brokenRules );
    expect( ctx.ruleId ).toBe( 'writeProperty.property' );
    expect( ctx.user ).toEqual( jasmine.any( UserInfo ) );
    expect( ctx.locale ).toBe( 'hu-HU' );
  } );

  it( 'has read-only properties', () => {

    const ctx = new AuthorizationContext( AuthorizationAction.writeProperty, 'property', brokenRules );
    ctx.brokenRules = null;
    ctx.ruleId = null;
    ctx.user = null;
    ctx.locale = null;

    expect( ctx.brokenRules ).not.toBeNull();
    expect( ctx.ruleId ).not.toBeNull();
    expect( ctx.user ).not.toBeNull();
    expect( ctx.locale ).not.toBeNull();
  } );
} );
