console.log( 'Testing rules/validation-result.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const ValidationResult = read( 'rules/validation-result.js' );
const ResultBase = read( 'rules/result-base.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const BrokenRule = read( 'rules/broken-rule.js' );

describe( 'Validation result', () => {

  it( 'constructor expects three non-empty string arguments', () => {

    const build01 = function () { return new ValidationResult(); };
    const build02 = function () { return new ValidationResult( 'ruleName' ); };
    const build03 = function () { return new ValidationResult( 'ruleName', 'propertyName' ); };
    const build04 = function () { return new ValidationResult( 'ruleName', 'propertyName', 'message' ); };
    const build05 = function () { return new ValidationResult( '', 'propertyName', 'message' ); };
    const build06 = function () { return new ValidationResult( 'ruleName', '', 'message' ); };
    const build07 = function () { return new ValidationResult( 'ruleName', 'propertyName', '' ); };
    const build08 = function () { return new ValidationResult( null, null, null ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
  } );

  it( 'inherits result base type', () => {

    const result = new ValidationResult( 'ruleName', 'propertyName', 'message' );

    expect( result ).toEqual( jasmine.any( ResultBase ) );
  } );

  it( 'has seven properties', () => {

    const result = new ValidationResult( 'ruleName', 'propertyName', 'message' );

    expect( result.ruleName ).toBe( 'ruleName' );
    expect( result.propertyName ).toBe( 'propertyName' );
    expect( result.message ).toBe( 'message' );
    expect( result.severity ).toBe( RuleSeverity.error );
    expect( result.stopsProcessing ).toBe( false );
    expect( result.isPreserved ).toBe( false );
    expect( result.affectedProperties ).toBeNull();
  } );

  it( 'toBrokenRule method works', () => {

    const result = new ValidationResult( 'ruleName', 'propertyName', 'message' );
    const broken = result.toBrokenRule();
    broken.isPreserved = true;
    broken.severity = RuleSeverity.information;

    expect( broken ).toEqual( jasmine.any( BrokenRule ) );
    expect( broken.ruleName ).toBe( 'ruleName' );
    expect( broken.isPreserved ).toBe( true );
    expect( broken.propertyName ).toBe( 'propertyName' );
    expect( broken.message ).toBe( 'message' );
    expect( broken.severity ).toBe( RuleSeverity.information );
  } );
} );
