console.log( 'Testing rules/authorization-result.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const AuthorizationResult = read( 'rules/authorization-result.js' );
const ResultBase = read( 'rules/result-base.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const BrokenRule = read( 'rules/broken-rule.js' );

describe( 'Authorization result', () => {

  it( 'constructor expects three non-empty string arguments', () => {

    const build01 = function() { return new AuthorizationResult(); };
    const build02 = function() { return new AuthorizationResult( 'ruleName' ); };
    const build03 = function() { return new AuthorizationResult( 'ruleName', 'targetName' ); };
    const build04 = function() { return new AuthorizationResult( 'ruleName', 'targetName', 'message' ); };
    const build05 = function() { return new AuthorizationResult( '', 'targetName', 'message' ); };
    const build06 = function() { return new AuthorizationResult( 'ruleName', '', 'message' ); };
    const build07 = function() { return new AuthorizationResult( 'ruleName', 'targetName', '' ); };
    const build08 = function() { return new AuthorizationResult( null, null, null ); };
    const build09 = function() { return new AuthorizationResult( 'ruleName', null, 'message' ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
    expect( build09 ).not.toThrow();
  } );

  it( 'inherits result base type', () => {

    const result = new AuthorizationResult( 'ruleName', 'targetName', 'message' );

    expect( result ).toEqual( jasmine.any( ResultBase ) );
  } );

  it( 'has six properties', () => {

    const result = new AuthorizationResult( 'ruleName', 'targetName', 'message' );

    expect( result.ruleName ).toBe( 'ruleName' );
    expect( result.propertyName ).toBe( 'targetName' );
    expect( result.message ).toBe( 'message' );
    expect( result.severity ).toBe( RuleSeverity.error );
    expect( result.stopsProcessing ).toBe( false );
    expect( result.isPreserved ).toBe( false );
  } );

  it( 'toBrokenRule method works', () => {

    const result = new AuthorizationResult( 'ruleName', 'targetName', 'message' );
    const broken = result.toBrokenRule();
    broken.isPreserved = true;
    broken.severity = RuleSeverity.information;

    expect( broken ).toEqual( jasmine.any( BrokenRule ) );
    expect( broken.ruleName ).toBe( 'ruleName' );
    expect( broken.isPreserved ).toBe( true );
    expect( broken.propertyName ).toBe( 'targetName' );
    expect( broken.message ).toBe( 'message' );
    expect( broken.severity ).toBe( RuleSeverity.information );
  } );
} );
