console.log( 'Testing common-rules/information-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const InformationRule = read( 'common-rules/information-rule.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Information rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects two-to-four arguments', () => {

    const build01 = function () { return new InformationRule(); };
    const build02 = function () { return new InformationRule( 2048 ); };
    const build03 = function () { return new InformationRule( 'property' ); };
    const build04 = function () { return new InformationRule( { property: 'name' } ); };
    const build05 = function () { return new InformationRule( pi ); };
    const build06 = function () { return new InformationRule( pi, 'message' ); };
    const build07 = function () { return new InformationRule( pi, 'message', 3 ); };
    const build08 = function () { return new InformationRule( pi, 'message', 3, false ); };

    expect( build01 ).toThrow( 'The message argument of InformationRule constructor must be a non-empty string.' );
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new InformationRule( pi, 'message', 3, false );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new InformationRule( pi, 'message', 3, false );

    expect( rule.ruleName ).toBe( 'Information' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 3 );
    expect( rule.stopsProcessing ).toBe( false );
  } );

  it( 'execute method works', () => {

    const rule = new InformationRule( pi, 'message', 3, false );

    const result01 = rule.execute();
    const result02 = rule.execute( { property: '' } );
    const result03 = rule.execute( { property: 'Welcome!' } );

    expect( result01 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result02 ).toEqual( jasmine.any( ValidationResult ) );
    expect( result03 ).toEqual( jasmine.any( ValidationResult ) );

    expect( result03.ruleName ).toBe( 'Information' );
    expect( result03.propertyName ).toBe( 'property' );
    expect( result03.message ).toBe( 'message' );
    expect( result03.severity ).toBe( RuleSeverity.information );
    expect( result03.stopsProcessing ).toBe( false );
    expect( result03.isPreserved ).toBe( false );
    expect( result03.affectedProperties.length ).toBe( 0 );
  } );
} );
