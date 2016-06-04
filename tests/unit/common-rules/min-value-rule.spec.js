console.log( 'Testing common-rules/min-value-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const MinValueRule = read( 'common-rules/min-value-rule.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Min-value rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects two-to-five arguments', () => {

    const build01 = function () { return new MinValueRule(); };
    const build02 = function () { return new MinValueRule( 512 ); };
    const build03 = function () { return new MinValueRule( 'property' ); };
    const build04 = function () { return new MinValueRule( pi ); };
    const build05 = function () { return new MinValueRule( pi, 128 ); };
    const build06 = function () { return new MinValueRule( pi, 128, 'message' ); };
    const build07 = function () { return new MinValueRule( pi, 128, 'message', 13 ); };
    const build08 = function () { return new MinValueRule( pi, 128, 'message', 13, true ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow( 'The minValue argument of MinValueRule constructor is required.' );
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new MinValueRule( pi, 128, 'message', 13, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new MinValueRule( pi, 128, 'message', 13, true );

    expect( rule.ruleName ).toBe( 'MinValue' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 13 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new MinValueRule( pi, 128, 'message', 13, true );

    const call01 = function () { rule.execute(); };
    const result01 = rule.execute( { property: -1 } );
    const result02 = rule.execute( { property: 0 } );
    const result03 = rule.execute( { property: 1 } );
    const result04 = rule.execute( { property: 127 } );
    const result05 = rule.execute( { property: 128 } );
    const result06 = rule.execute( { property: 129 } );
    const result07 = rule.execute( { property: 500 } );

    expect( call01 ).toThrow();
    expect( result01 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result02 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result03 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result04 ).toEqual( jasmine.any( ValidationResult ) );

    expect( result05 ).toBeUndefined();
    expect( result06 ).toBeUndefined();
    expect( result07 ).toBeUndefined();

    expect( result01.ruleName ).toBe( 'MinValue' );
    expect( result01.propertyName ).toBe( 'property' );
    expect( result01.message ).toBe( 'message' );
    expect( result01.severity ).toBe( RuleSeverity.error );
    expect( result01.stopsProcessing ).toBe( true );
    expect( result01.isPreserved ).toBe( false );
    expect( result01.affectedProperties.length ).toBe( 0 );
  } );
} );
