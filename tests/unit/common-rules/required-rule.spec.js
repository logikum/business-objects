console.log( 'Testing common-rules/required-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const RequiredRule = read( 'common-rules/required-rule.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Required rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects one-to-four arguments', () => {

    const build01 = function () { return new RequiredRule(); };
    const build02 = function () { return new RequiredRule( 51 ); };
    const build03 = function () { return new RequiredRule( 'property' ); };
    const build04 = function () { return new RequiredRule( { property: 'name' } ); };
    const build05 = function () { return new RequiredRule( pi ); };
    const build06 = function () { return new RequiredRule( pi, 'message' ); };
    const build07 = function () { return new RequiredRule( pi, 'message', 100 ); };
    const build08 = function () { return new RequiredRule( pi, 'message', 100, true ); };

    expect( build01 ).toThrow( 'The primaryProperty argument of RequiredRule.initialize method must be a PropertyInfo object.' );
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new RequiredRule( pi, 'message', 100, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new RequiredRule( pi, 'message', 100, true );

    expect( rule.ruleName ).toBe( 'Required' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 100 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new RequiredRule( pi, 'message', 100, true );

    const call01 = function () { rule.execute(); };
    const result01 = rule.execute( { property: 'Hello!' } );
    const result02 = rule.execute( { property: '' } );

    expect( call01 ).toThrow();
    expect( result01 ).toBeUndefined();

    expect( result02 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result02.ruleName ).toBe( 'Required' );
    expect( result02.propertyName ).toBe( 'property' );
    expect( result02.message ).toBe( 'message' );
    expect( result02.severity ).toBe( RuleSeverity.error );
    expect( result02.stopsProcessing ).toBe( true );
    expect( result02.isPreserved ).toBe( false );
    expect( result02.affectedProperties.length ).toBe( 0 );
  } );
} );
