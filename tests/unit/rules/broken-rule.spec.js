console.log( 'Testing rules/broken-rule.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const BrokenRule = read( 'rules/broken-rule.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Broken rule', () => {

  it( 'constructor expects five arguments', () => {

    const build01 = function () { return new BrokenRule(); };
    const build02 = function () { return new BrokenRule( 'name' ); };
    const build03 = function () { return new BrokenRule( 'name', true ); };
    const build04 = function () { return new BrokenRule( 'name', false, 'property' ); };
    const build05 = function () { return new BrokenRule( 'name', true, 'property', 'message' ); };
    const build06 = function () { return new BrokenRule( 'name', false, 'property', 'message', RuleSeverity.error ); };
    const build07 = function () { return new BrokenRule( 'name', false, 'property', 'message', RuleSeverity.success ); };
    const build08 = function () { return new BrokenRule( 1, 2, 3, 4, 5 ); };
    const build09 = function () { return new BrokenRule( 'name', null, null, 'message' ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).toThrow();
    expect( build09 ).not.toThrow();
  } );

  it( 'has five properties', () => {

    const br = new BrokenRule( 'name', false, 'property', 'message', RuleSeverity.success );

    expect( br.ruleName ).toBe( 'name' );
    expect( br.isPreserved ).toBe( false );
    expect( br.propertyName ).toBe( 'property' );
    expect( br.message ).toBe( 'message' );
    expect( br.severity ).toBe( RuleSeverity.success );
  } );
} );
