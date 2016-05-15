console.log( 'Testing rules/validation-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ValidationRule = read( 'rules/validation-rule.js' );
const RuleBase = read( 'rules/rule-base.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const DataStore = read( 'shared/data-store.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const PropertyManager = read( 'shared/property-manager.js' );
const Text = read( 'data-types/text.js' );

describe( 'Validation rule', () => {

  it( 'constructor expects a non-empty string argument', () => {

    const build01 = function () { return new ValidationRule(); };
    const build02 = function () { return new ValidationRule( null ); };
    const build03 = function () { return new ValidationRule( '' ); };
    const build04 = function () { return new ValidationRule( 'ruleName' ); };
    const build05 = function () { return new ValidationRule( true ); };
    const build06 = function () { return new ValidationRule( 777 ); };
    const build07 = function () { return new ValidationRule( {} ); };
    const build08 = function () { return new ValidationRule( [ 'ruleName' ] ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
  } );

  it( 'inherits rule base type', () => {

    const rule = new ValidationRule( 'ruleName' );

    expect( rule ).toEqual( jasmine.any( RuleBase ) );
  } );

  it( 'has five properties', () => {

    const rule = new ValidationRule( 'ruleName' );

    expect( rule.ruleName ).toBe( 'ruleName' );
    expect( rule.primaryProperty ).toBeNull();
    expect( rule.message ).toBeNull();
    expect( rule.priority ).toBe( 10 );
    expect( rule.stopsProcessing ).toBe( false );
  } );

  it( 'initialize method works', () => {

    const rule = new ValidationRule( 'ruleName' );
    const property = new PropertyInfo( 'property', new Text() );
    rule.initialize( property, 'message', 19, true );

    expect( rule.ruleName ).toBe( 'ruleName' );
    expect( rule.primaryProperty ).toBe( property );
    expect( rule.message ).toBe( 'message' );
    expect( rule.priority ).toBe( 19 );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'addInputProperty method expects a property info object', () => {

    const rule = new ValidationRule( 'ruleName' );
    const property = new PropertyInfo( 'property', new Text() );

    const add01 = function () { rule.addInputProperty(); };
    const add02 = function () { rule.addInputProperty( 1356.2468 ); };
    const add03 = function () { rule.addInputProperty( true ); };
    const add04 = function () { rule.addInputProperty( 'property' ); };
    const add05 = function () { rule.addInputProperty( { property: property } ); };
    const add06 = function () { rule.addInputProperty( [ property ] ); };
    const add07 = function () { rule.addInputProperty( property ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).toThrow();
    expect( add05 ).toThrow();
    expect( add06 ).toThrow();
    expect( add07 ).not.toThrow();
  } );

  it( 'addAffectedProperty method expects a property info object', () => {

    const rule = new ValidationRule( 'ruleName' );
    const property = new PropertyInfo( 'property', new Text() );

    const add01 = function () { rule.addAffectedProperty(); };
    const add02 = function () { rule.addAffectedProperty( 1356.2468 ); };
    const add03 = function () { rule.addAffectedProperty( true ); };
    const add04 = function () { rule.addAffectedProperty( 'property' ); };
    const add05 = function () { rule.addAffectedProperty( { property: property } ); };
    const add06 = function () { rule.addAffectedProperty( [ property ] ); };
    const add07 = function () { rule.addAffectedProperty( property ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).toThrow();
    expect( add05 ).toThrow();
    expect( add06 ).toThrow();
    expect( add07 ).not.toThrow();
  } );

  it( 'getInputValues method works', () => {

    const primary = new PropertyInfo( 'primary', new Text() );
    const secondary = new PropertyInfo( 'secondary', new Text() );
    const pm = new PropertyManager();
    const rule = new ValidationRule( 'ruleName' );
    const store = new DataStore();

    pm.add( primary );
    pm.add( secondary );
    store.setValue( primary, 'turtle' );
    store.setValue( secondary, 'beach' );

    rule.initialize( primary, 'message', 19, true );
    rule.addInputProperty( secondary );

    expect( rule.getInputValues( store.getValue ) ).toEqual( {
      primary: 'turtle',
      secondary: 'beach'
    } );
  } );

  it( 'result method works', () => {

    const rule = new ValidationRule( 'ruleName' );
    const primary = new PropertyInfo( 'primary', new Text() );
    const affected = new PropertyInfo( 'affected', new Text() );
    rule.initialize( primary, 'message', 19, true );
    rule.addAffectedProperty( affected );
    const result = rule.result( 'final message', RuleSeverity.warning );

    expect( result ).toEqual( jasmine.any( ValidationResult ) );
    expect( result.ruleName ).toBe( 'ruleName' );
    expect( result.propertyName ).toBe( 'primary' );
    expect( result.message ).toBe( 'final message' );
    expect( result.severity ).toBe( RuleSeverity.warning );
    expect( result.stopsProcessing ).toBe( true );
    expect( result.isPreserved ).toBe( false );
    expect( result.affectedProperties ).toEqual( [ affected ] );
  } );
} );
