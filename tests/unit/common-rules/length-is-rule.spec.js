console.log( 'Testing common-rules/length-is-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const LengthIsRule = read( 'common-rules/length-is-rule.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Length-is rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects two-to-five arguments', () => {

    const build01 = function () { return new LengthIsRule(); };
    const build02 = function () { return new LengthIsRule( 51 ); };
    const build03 = function () { return new LengthIsRule( 'property' ); };
    const build04 = function () { return new LengthIsRule( pi ); };
    const build05 = function () { return new LengthIsRule( pi, 8 ); };
    const build06 = function () { return new LengthIsRule( pi, 8, 'message' ); };
    const build07 = function () { return new LengthIsRule( pi, 8, 'message', 20 ); };
    const build08 = function () { return new LengthIsRule( pi, 8, 'message', 20, true ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow( 'The length argument of LengthIsRule constructor must be an integer value.' );
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new LengthIsRule( pi, 8, 'message', 20, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new LengthIsRule( pi, 8, 'message', 20, true );

    expect( rule.ruleName ).toBe( 'LengthIs' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 20 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new LengthIsRule( pi, 8, 'message', 20, true );

    const call01 = function () { rule.execute(); };
    const result01 = rule.execute( { property: 'New York' } );
    const result02 = rule.execute( { property: '' } );
    const result03 = rule.execute( { property: 'London' } );
    const result04 = rule.execute( { property: 'Buenos Aires' } );

    expect( call01 ).toThrow();
    expect( result01 ).toBeUndefined();

    expect( result02 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result03 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result04 ).toEqual( jasmine.any( ValidationResult ) );

    expect( result02.ruleName ).toBe( 'LengthIs' );
    expect( result02.propertyName ).toBe( 'property' );
    expect( result02.message ).toBe( 'message' );
    expect( result02.severity ).toBe( RuleSeverity.error );
    expect( result02.stopsProcessing ).toBe( true );
    expect( result02.isPreserved ).toBe( false );
    expect( result02.affectedProperties.length ).toBe( 0 );
  } );
} );
