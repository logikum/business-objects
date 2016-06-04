console.log( 'Testing rules/rule-list.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const RuleList = read( 'rules/rule-list.js' );
const InformationRule = read( 'common-rules/information-rule.js' );
const RequiredRule = read( 'common-rules/required-rule.js' );
const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );

describe( 'Rule list', () => {

  it( 'constructor expects no argument', () => {

    const build01 = function () { return new RuleList(); };

    expect( build01 ).not.toThrow();
  } );

  it( 'add method expects a non-empty string and a rule argument', () => {

    const rl = new RuleList();
    const pi = new PropertyInfo( 'property', new Text() );
    const rule = new RequiredRule( pi, 'message', 13, true );

    const add01 = function () { rl.set(); };
    const add02 = function () { rl.set( 'property' ); };
    const add03 = function () { rl.set( 'property', 'message' ); };
    const add04 = function () { rl.set( 'property', rule ); };
    const add05 = function () { rl.set( '', rule ); };
    const add06 = function () { rl.set( null, rule ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).not.toThrow();
    expect( add05 ).toThrow();
    expect( add06 ).toThrow();
  } );

  it( 'add method creates an array property', () => {

    const rl = new RuleList();
    const pi = new PropertyInfo( 'property', new Text() );
    const rule1 = new InformationRule( pi, 'message #1', 7, false );
    const rule2 = new RequiredRule( pi, 'message #2', 13, true );
    rl.set( 'property', rule1 );
    rl.set( 'property', rule2 );

    expect( rl.get('property') ).toEqual( jasmine.any( Array ) );
    expect( rl.get('property')[ 0 ].message ).toBe( 'message #1' );
    expect( rl.get('property')[ 0 ].priority ).toBe( 7 );
    expect( rl.get('property')[ 0 ].stopsProcessing ).toBe( false );
    expect( rl.get('property')[ 1 ].message ).toBe( 'message #2' );
    expect( rl.get('property')[ 1 ].priority ).toBe( 13 );
    expect( rl.get('property')[ 1 ].stopsProcessing ).toBe( true );
  } );

  it( 'sort method arranges items by priority', () => {

    const rl = new RuleList();
    const pi = new PropertyInfo( 'property', new Text() );
    const rule1 = new InformationRule( pi, 'message #1', 7, false );
    const rule2 = new RequiredRule( pi, 'message #2', 13, true );
    rl.set( 'property', rule1 );
    rl.set( 'property', rule2 );
    rl.sort();

    expect( rl.get('property')[ 0 ].message ).toBe( 'message #2' );
    expect( rl.get('property')[ 1 ].message ).toBe( 'message #1' );
  } );
} );
