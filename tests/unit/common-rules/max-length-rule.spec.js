console.log( 'Testing common-rules/max-length-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const MaxLengthRule = read( 'common-rules/max-length-rule.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Max-length rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects two-to-five arguments', () => {

    const build01 = function () { return new MaxLengthRule(); };
    const build02 = function () { return new MaxLengthRule( 73 ); };
    const build03 = function () { return new MaxLengthRule( 'property' ); };
    const build04 = function () { return new MaxLengthRule( pi ); };
    const build05 = function () { return new MaxLengthRule( pi, 8 ); };
    const build06 = function () { return new MaxLengthRule( pi, 8, 'message' ); };
    const build07 = function () { return new MaxLengthRule( pi, 8, 'message', 15 ); };
    const build08 = function () { return new MaxLengthRule( pi, 8, 'message', 15, true ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow( 'The maxLength argument of MaxLengthRule constructor must be an integer value.' );
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new MaxLengthRule( pi, 8, 'message', 15, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new MaxLengthRule( pi, 8, 'message', 15, true );

    expect( rule.ruleName ).toBe( 'MaxLength' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 15 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new MaxLengthRule( pi, 8, 'message', 15, true );

    const call01 = function () { rule.execute(); };
    const result01 = rule.execute( { property: '' } );
    const result02 = rule.execute( { property: 'London' } );
    const result03 = rule.execute( { property: 'New York' } );
    const result04 = rule.execute( { property: 'Buenos Aires' } );

    expect( call01 ).toThrow();
    expect( result01 ).toBeUndefined();
    expect( result02 ).toBeUndefined();
    expect( result03 ).toBeUndefined();

    expect( result04 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result04.ruleName ).toBe( 'MaxLength' );
    expect( result04.propertyName ).toBe( 'property' );
    expect( result04.message ).toBe( 'message' );
    expect( result04.severity ).toBe( RuleSeverity.error );
    expect( result04.stopsProcessing ).toBe( true );
    expect( result04.isPreserved ).toBe( false );
    expect( result04.affectedProperties.length ).toBe( 0 );
  } );
} );
