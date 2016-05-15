console.log( 'Testing rules/data-type-rule.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const DataTypeRule = read( 'rules/data-type-rule.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const Text = read( 'data-types/text.js' );
const ValidationRule = read( 'rules/validation-rule.js' );
const ValidationResult = read( 'rules/validation-result.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Data type rule', () => {

  const pi = new PropertyInfo( 'property', new Text() );

  it( 'constructor expects one argument', () => {

    const build01 = function () { return new DataTypeRule(); };
    const build02 = function () { return new DataTypeRule( 51 ); };
    const build03 = function () { return new DataTypeRule( 'property' ); };
    const build04 = function () { return new DataTypeRule( { property: 'name' } ); };
    const build05 = function () { return new DataTypeRule( pi ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).not.toThrow();
  } );

  it( 'inherits validation rule type', () => {

    const rule = new DataTypeRule( pi );

    expect( rule ).toEqual( jasmine.any( ValidationRule ) );
  } );

  it( 'has four properties', () => {

    const rule = new DataTypeRule( pi );

    expect( rule.ruleName ).toBe( 'DataType' );
    expect( rule.message ).toBe( 'The data type of the value of property property must be Text.' );
    expect( rule.priority ).toBe( Number.MAX_VALUE );
    expect( rule.stopsProcessing ).toBe( true );
  } );

  it( 'execute method works', () => {

    const rule = new DataTypeRule( pi );

    const result01 = rule.execute();
    const result02 = rule.execute( { property: 123 } );
    const result03 = rule.execute( { customer: 'Attila' } );

    expect( result01 ).toBeUndefined();
    expect( result02 ).toBeUndefined();
    expect( result03 ).toBeUndefined();
  } );
} );
