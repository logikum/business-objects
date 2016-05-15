console.log( 'Testing common-rules/is-not-in-any-role-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const IsNotInAnyRoleRule = read( 'common-rules/is-not-in-any-role-rule.js' );
const AuthorizationRule = read( 'rules/authorization-rule.js' );
const AuthorizationAction = read( 'rules/authorization-action.js' );

const User = require( '../../../data/user.js' );

describe( 'Is-not-in-any-role rule', () => {

  it( 'constructor expects three-to-six arguments', () => {

    const build01 = function () { return new IsNotInAnyRoleRule(); };
    const build02 = function () { return new IsNotInAnyRoleRule( AuthorizationAction.updateObject ); };
    const build03 = function () { return new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null ); };
    const build04 = function () {
      return new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, 'developers' );
    };
    const build05 = function () { return new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, [ 'men', 'women' ] ); };
    const build06 = function () { return new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, [ 'men', 'women' ], 'message' ); };
    const build07 = function () { return new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, [ 'men', 'women' ], 'message', 100 ); };
    const build08 = function () { return new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, [ 'men', 'women' ], 'message', 100, true ); };
    const build09 = function () { return new IsNotInAnyRoleRule( 4, null, [ 'men', 'women' ], 'message', 100, true ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
    expect( build09 ).not.toThrow();
  } );

  it( 'inherits authorization rule type', () => {

    const rule = new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, [ 'men', 'women' ], 'message', 100, true );

    expect( rule ).toEqual( jasmine.any( AuthorizationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new IsNotInAnyRoleRule( AuthorizationAction.updateObject, null, [ 'men', 'women' ], 'message', 100, true );

    expect( rule.ruleName ).toBe( 'IsNotInAnyRole' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 100 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const john = new User( 'john', 'John Smith', 'john@company.com', [ 'salesmen' ] );
    const paul = new User( 'paul', 'Paul Smith', 'paul@company.com', [ 'testers', 'developers' ] );
    const rule_1 = new IsNotInAnyRoleRule( AuthorizationAction.createObject, null, [ 'developers', 'designers' ], 'message', 100, true );
    const rule_2 = new IsNotInAnyRoleRule( AuthorizationAction.removeObject, null, [ 'salesmen', 'managers' ], 'message', 100, true );

    const call01 = function () { rule_1.execute(); };
    const call02 = function () { rule_1.execute( paul ); };
    const call03 = function () { rule_2.execute( john ); };

    expect( call01 ).toThrow();
    expect( call02 ).toThrow();
    expect( rule_1.execute( john ) ).toBeUndefined();
    expect( rule_2.execute( paul ) ).toBeUndefined();
  } );
} );
