console.log( 'Testing main.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const BrokenRuleList = read( 'rules/broken-rule-list.js' );
const BrokenRule = read( 'rules/broken-rule.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const Text = read( 'data-types/text.js' );

describe( 'Broken rule list', () => {

  it( 'constructor expects a non-empty string argument', () => {

    const build01 = function () { return new BrokenRuleList(); };
    const build02 = function () { return new BrokenRuleList( 1.234 ); };
    const build03 = function () { return new BrokenRuleList( true ); };
    const build04 = function () { return new BrokenRuleList( '' ); };
    const build05 = function () { return new BrokenRuleList( null ); };
    const build06 = function () { return new BrokenRuleList( {} ); };
    const build07 = function () { return new BrokenRuleList( [] ); };
    const build08 = function () { return new BrokenRuleList( 'model' ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).not.toThrow();
  } );

  it( 'has one read-only property', () => {

    const brl = new BrokenRuleList( 'Employee' );
    expect( brl.modelName ).toBe( 'Employee' );

    brl.modelName = 'Customer';
    expect( brl.modelName ).toBe( 'Employee' );
  } );

  it( 'add method expects a broken rule argument', () => {

    const brl = new BrokenRuleList( 'model' );
    const br = new BrokenRule( 'name', false, 'property', 'message', RuleSeverity.error );

    const add01 = function () { brl.add(); };
    const add02 = function () { brl.add( 'property' ); };
    const add03 = function () { brl.add( 'property', 'message' ); };
    const add04 = function () { brl.add( 'property', br ); };
    const add05 = function () { brl.add( br ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).toThrow();
    expect( add05 ).not.toThrow();
  } );

  it( 'isValid method works', () => {

    const brl1 = new BrokenRuleList( 'model' );
    const br1 = new BrokenRule( 'name #1', false, 'property', 'message #1', RuleSeverity.success );
    brl1.add( br1 );
    const brl2 = new BrokenRuleList( 'model' );
    const br2 = new BrokenRule( 'name #2', true, 'property', 'message #2', RuleSeverity.error );
    brl2.add( br2 );

    expect( brl1.isValid() ).toBe( true );
    expect( brl2.isValid() ).toBe( false );
  } );

  it( 'output method converts broken rules', () => {

    const brl = new BrokenRuleList( 'model' );
    const br1 = new BrokenRule( 'name #1', false, 'property1', 'message #1', RuleSeverity.warning );
    const br2 = new BrokenRule( 'name #2', true, 'property2', 'message #2', RuleSeverity.error );
    brl.add( br1 );
    brl.add( br2 );
    let brs = brl.output();

    expect( brs[ 'model.property1' ] ).toEqual( jasmine.any( Array ) );
    expect( brs[ 'model.property1' ][ 0 ].message ).toBe( 'message #1' );
    expect( brs[ 'model.property1' ][ 0 ].severity ).toBe( RuleSeverity.warning );
    expect( brs[ 'model.property2' ] ).toEqual( jasmine.any( Array ) );
    expect( brs[ 'model.property2' ][ 0 ].message ).toBe( 'message #2' );
    expect( brs[ 'model.property2' ][ 0 ].severity ).toBe( RuleSeverity.error );

    brl.clearAll();
    brs = brl.output();

    expect( brs.$length ).toBe( 0 );
  } );

  it( 'clear and clearAll methods work for a property', () => {

    const brl = new BrokenRuleList( 'model' );
    const br1 = new BrokenRule( 'name #1', false, 'property', 'message #1', RuleSeverity.error );
    const br2 = new BrokenRule( 'name #2', true, 'property', 'message #2', RuleSeverity.error );
    brl.add( br1 );
    brl.add( br2 );
    const pi = new PropertyInfo( 'property', new Text() );

    brl.clear( pi );
    let brs = brl.output();

    expect( brs[ 'model.property' ] ).toEqual( jasmine.any( Array ) );
    expect( brs[ 'model.property' ][ 0 ].message ).toBe( 'message #2' );

    brl.clearAll( pi );
    brs = brl.output();

    expect( brs.$length ).toBe( 0 );
  } );

  it( 'clear and clearAll methods work for all properties', () => {

    const brl = new BrokenRuleList( 'model' );
    const br1 = new BrokenRule( 'name #1', false, 'property1', 'message #1', RuleSeverity.error );
    const br2 = new BrokenRule( 'name #2', true, 'property2', 'message #2', RuleSeverity.error );
    brl.add( br1 );
    brl.add( br2 );

    brl.clear();
    let brs = brl.output();

    expect( brs[ 'model.property1' ] ).not.toBeDefined();
    expect( brs[ 'model.property2' ] ).toEqual( jasmine.any( Array ) );
    expect( brs[ 'model.property2' ][ 0 ].message ).toBe( 'message #2' );

    brl.clearAll();
    brs = brl.output();

    expect( brs.$length ).toBe( 0 );
  } );
} );
