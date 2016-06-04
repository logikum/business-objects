console.log( 'Testing common-rules/expression-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ExpressionRule = read( 'common-rules/expression-rule.js' );
const NullResultOption = read( 'common-rules/null-result-option.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Expression rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );
  const re = new RegExp( '[-+]?[0-9]*\.?[0-9]+', 'g' );

  it( 'constructor expects three-to-six arguments', () => {

    const build01 = function () { return new ExpressionRule(); };
    const build02 = function () { return new ExpressionRule( true ); };
    const build03 = function () { return new ExpressionRule( pi ); };
    const build04 = function () { return new ExpressionRule( pi, re ); };
    const build05 = function () { return new ExpressionRule( pi, re, true ); };
    const build06 = function () { return new ExpressionRule( pi, re, NullResultOption.returnFalse ); };
    const build07 = function () { return new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message' ); };
    const build08 = function () { return new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message', 30 ); };
    const build09 = function () { return new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message', 30, true ); };
    const build10 = function () { return new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message', 30, true ); };


    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow( 'The option argument of ExpressionRule constructor must be a NullResultOption item.' );
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
    expect( build09 ).not.toThrow();
    expect( build10 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message', 30, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message', 30, true );

    expect( rule.ruleName ).toBe( 'Expression' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 30 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new ExpressionRule( pi, re, NullResultOption.returnFalse, 'message', 30, true );

    const call01 = function () { rule.execute(); };
    const result01 = rule.execute( { property: '' } );
    const result02 = rule.execute( { property: '12.56' } );
    const result03 = rule.execute( { property: '  -102.987 ' } );
    const result04 = rule.execute( { property: 'The price is $49.99.' } );

    expect( call01 ).toThrow();
    expect( result02 ).toBeUndefined();
    expect( result03 ).toBeUndefined();
    expect( result04 ).toBeUndefined();

    expect( result01 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result01.ruleName ).toBe( 'Expression' );
    expect( result01.propertyName ).toBe( 'property' );
    expect( result01.message ).toBe( 'message' );
    expect( result01.severity ).toBe( RuleSeverity.error );
    expect( result01.stopsProcessing ).toBe( true );
    expect( result01.isPreserved ).toBe( false );
    expect( result01.affectedProperties.length ).toBe( 0 );
  } );
} );
