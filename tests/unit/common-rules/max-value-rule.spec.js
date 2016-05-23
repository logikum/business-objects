console.log( 'Testing common-rules/max-value-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const MaxValueRule = read( 'common-rules/max-value-rule.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Max-value rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects two-to-five arguments', () => {

    const build01 = function () { return new MaxValueRule(); };
    const build02 = function () { return new MaxValueRule( 512 ); };
    const build03 = function () { return new MaxValueRule( 'property' ); };
    const build04 = function () { return new MaxValueRule( pi ); };
    const build05 = function () { return new MaxValueRule( pi, 1024 ); };
    const build06 = function () { return new MaxValueRule( pi, 1024, 'message' ); };
    const build07 = function () { return new MaxValueRule( pi, 1024, 'message', 13 ); };
    const build08 = function () { return new MaxValueRule( pi, 1024, 'message', 13, true ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow( 'The maxValue argument of MaxValueRule constructor is required.' );
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new MaxValueRule( pi, 1024, 'message', 13, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new MaxValueRule( pi, 1024, 'message', 13, true );

    expect( rule.ruleName ).toBe( 'MaxValue' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 13 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new MaxValueRule( pi, 1024, 'message', 13, true );

    const call01 = function () { rule.execute(); };
    const result01 = rule.execute( { property: -1 } );
    const result02 = rule.execute( { property: 0 } );
    const result03 = rule.execute( { property: 1 } );
    const result04 = rule.execute( { property: 1023 } );
    const result05 = rule.execute( { property: 1024 } );
    const result06 = rule.execute( { property: 1025 } );
    const result07 = rule.execute( { property: 2000 } );

    expect( call01 ).toThrow();
    expect( result01 ).toBeUndefined();
    expect( result02 ).toBeUndefined();
    expect( result03 ).toBeUndefined();
    expect( result04 ).toBeUndefined();
    expect( result05 ).toBeUndefined();

    expect( result06 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result07 ).toEqual( jasmine.any( ValidationResult ) );

    expect( result06.ruleName ).toBe( 'MaxValue' );
    expect( result06.propertyName ).toBe( 'property' );
    expect( result06.message ).toBe( 'message' );
    expect( result06.severity ).toBe( RuleSeverity.error );
    expect( result06.stopsProcessing ).toBe( true );
    expect( result06.isPreserved ).toBe( false );
    expect( result06.affectedProperties.length ).toBe( 0 );
  } );
} );
