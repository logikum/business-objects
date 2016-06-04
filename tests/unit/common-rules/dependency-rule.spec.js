console.log( 'Testing common-rules/dependency-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const DependencyRule = read( 'common-rules/dependency-rule.js' );
const PropertyInfo = read( 'common/property-info.js' );
const F = read( 'common/property-flag.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Dependency rule', () => {

  const pi = new PropertyInfo( 'property', new Text(), F.key );
  const di = new PropertyInfo( 'dependent', new Text() );
  const di2 = new PropertyInfo( 'calculated', new Text(), F.readOnly );

  it( 'constructor expects two-to-five arguments', () => {

    const build01 = function () { return new DependencyRule(); };
    const build02 = function () { return new DependencyRule( true ); };
    const build03 = function () { return new DependencyRule( 'property' ); };
    const build04 = function () { return new DependencyRule( pi ); };
    const build05 = function () { return new DependencyRule( pi, di ); };
    const build06 = function () { return new DependencyRule( pi, di, 'message' ); };
    const build07 = function () { return new DependencyRule( pi, di, 'message', 7 ); };
    const build08 = function () { return new DependencyRule( pi, di, 'message', 7, true ); };
    const build09 = function () { return new DependencyRule( pi, [ di, di2 ], 'message', 7, true ); };

    expect( build01 ).toThrow( 'The dependencies argument of DependencyRule constructor must be an array of PropertyInfo objects or a single PropertyInfo object.' );
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
    expect( build09 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new DependencyRule( pi, di, 'message', 7, true );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new DependencyRule( pi, di, 'message', 7, true );

    expect( rule.ruleName ).toBe( 'Dependency' );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 7 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule1 = new DependencyRule( pi, di, 'message #1', 7, true );
    //const ap1 = rule1.getAffectedProperties();
    const rule2 = new DependencyRule( pi, di2, 'message #2', 7, false );
    //const ap2 = rule2.getAffectedProperties();

    const call01 = function () { rule1.execute(); };
    const result01 = rule1.execute( { property: null } );
    const result02 = rule1.execute( { property: '' } );
    const result03 = rule1.execute( { property: 'value' } );

    expect( call01 ).toThrow();
    expect( result01 ).toBeUndefined();
    expect( result02 ).toBeUndefined();

    expect( result03 ).toEqual( jasmine.any( ValidationResult ) );

    expect( result03.ruleName ).toBe( 'Dependency' );
    expect( result03.propertyName ).toBe( 'property' );
    expect( result03.message ).toBe( 'message #1' );
    expect( result03.severity ).toBe( RuleSeverity.success );
    expect( result03.stopsProcessing ).toBe( true );
    expect( result03.isPreserved ).toBe( false );
    expect( result03.affectedProperties.length ).toBe( 1 );
    expect( result03.affectedProperties[ 0 ] ).toBe( di );

    const call02 = function () { rule2.execute(); };
    const result04 = rule2.execute( { property: null } );
    const result05 = rule2.execute( { property: '' } );
    const result06 = rule2.execute( { property: 'value' } );

    expect( call02 ).toThrow();
    expect( result04 ).toBeUndefined();
    expect( result05 ).toBeUndefined();

    expect( result06 ).toEqual( jasmine.any( ValidationResult ) );

    expect( result06.ruleName ).toBe( 'Dependency' );
    expect( result06.propertyName ).toBe( 'property' );
    expect( result06.message ).toBe( 'message #2' );
    expect( result06.severity ).toBe( RuleSeverity.success );
    expect( result06.stopsProcessing ).toBe( false );
    expect( result06.isPreserved ).toBe( false );
    expect( result06.affectedProperties.length ).toBe( 1 );
    expect( result06.affectedProperties[ 0 ] ).toBe( di2 );
  } );
} );
