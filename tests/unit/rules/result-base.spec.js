console.log( 'Testing rules/result-base.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const ResultBase = read( 'rules/result-base.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const BrokenRule = read( 'rules/broken-rule.js' );

describe( 'Rule base', () => {

  const rb = new ResultBase( 'rule', 'property', 'message' );

  it( 'has six properties', () => {

    expect( rb.ruleName ).toBe( 'rule' );
    expect( rb.propertyName ).toBe( 'property' );
    expect( rb.message ).toBe( 'message' );
    expect( rb.severity ).toBe( RuleSeverity.error );
    expect( rb.stopsProcessing ).toBe( false );
    expect( rb.isPreserved ).toBe( false );
  } );

  it( 'toBrokenRule method works', () => {

    //rb.ruleName = 'rule name';
    //rb.message = 'message';
    const broken = rb.toBrokenRule();

    expect( broken ).toEqual( jasmine.any( BrokenRule ) );
    expect( broken.ruleName ).toBe( 'rule' );
    expect( broken.isPreserved ).toBe( false );
    expect( broken.propertyName ).toBe( 'property' );
    expect( broken.message ).toBe( 'message' );
    expect( broken.severity ).toBe( RuleSeverity.error );
  } );
} );
