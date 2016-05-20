console.log( 'Testing rules/rule-notice.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const RuleNotice = read( 'rules/rule-notice.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Rule notice', () => {

  it( 'constructor expects five arguments', () => {

    const build01 = function () { return new RuleNotice(); };
    const build02 = function () { return new RuleNotice( 'message' ); };
    const build03 = function () { return new RuleNotice( 'message', RuleSeverity.error ); };
    const build04 = function () { return new RuleNotice( RuleSeverity.error, 'name' ); };
    const build05 = function () { return new RuleNotice( '', RuleSeverity.error ); };

    expect( build01 ).toThrow();
    expect( build02 ).not.toThrow();
    expect( build03 ).not.toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
  } );

  it( 'has two read-only properties', () => {

    const br = new RuleNotice( 'message', RuleSeverity.success );

    expect( br.message ).toBe( 'message' );
    expect( br.severity ).toBe( RuleSeverity.success );

    br.message = 'info';
    br.severity = RuleSeverity.warning;

    expect( br.message ).toBe( 'message' );
    expect( br.severity ).toBe( RuleSeverity.success );
  } );
} );
