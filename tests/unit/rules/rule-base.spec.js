console.log( 'Testing rules/rule-base.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const RuleBase = read( 'rules/rule-base.js' );

describe( 'Rule base', () => {
  const rb = new RuleBase( 'postalCode' );

  it( 'constructor expects a non-empty string argument', () => {

    const build01 = function () { return new RuleBase(); };
    const build02 = function () { return new RuleBase( null ); };
    const build03 = function () { return new RuleBase( '' ); };
    const build04 = function () { return new RuleBase( 'ruleName' ); };
    const build05 = function () { return new RuleBase( false ); };
    const build06 = function () { return new RuleBase( 125 ); };
    const build07 = function () { return new RuleBase( {} ); };
    const build08 = function () { return new RuleBase( [ 'ruleName' ] ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
  } );

  it( 'has four properties', () => {

    expect( rb.ruleName ).toBe( 'postalCode' );
    expect( rb.message ).toBeNull();
    expect( rb.priority ).toBe( 10 );
    expect( rb.stopsProcessing ).toBe( false );
  } );

  it( 'has one read-only property', () => {

    rb.ruleName = 'zip';
    rb.message = '';
    rb.priority = 33;
    rb.stopsProcessing = true;

    expect( rb.ruleName ).toBe( 'postalCode' );
    expect( rb.message ).toBe( '' );
    expect( rb.priority ).toBe( 33 );
    expect( rb.stopsProcessing ).toBe( true );
  } );

  it( 'initialize method expects a string,a number and a Boolean argument', () => {

    const init01 = function () { rb.initialize(); };
    const init02 = function () { rb.initialize( 'message' ); };
    const init03 = function () { rb.initialize( 10 ); };
    const init04 = function () { rb.initialize( true ); };
    const init05 = function () { rb.initialize( 'message', 10 ); };
    const init06 = function () { rb.initialize( 'message', false ); };
    const init07 = function () { rb.initialize( true, 'message' ); };
    const init08 = function () { rb.initialize( false, 40 ); };
    const init09 = function () { rb.initialize( 50, 'message' ); };
    const init10 = function () { rb.initialize( 60, false ); };
    const init11 = function () { rb.initialize( 'message', 10, true ); };
    const init12 = function () { rb.initialize( 'message', false, 20 ); };
    const init13 = function () { rb.initialize( true, 'message', 30 ); };
    const init14 = function () { rb.initialize( false, 40, 'message' ); };
    const init15 = function () { rb.initialize( 50, 'message', true ); };
    const init16 = function () { rb.initialize( 60, false, 'message' ); };
    const init17 = function () { rb.initialize( {} ); };
    const init18 = function () { rb.initialize( new Date() ); };
    const init19 = function () { rb.initialize( [] ); };
    const init20 = function () { rb.initialize( null, null, null ); };

    expect( init01 ).toThrow();
    expect( init02 ).not.toThrow();
    expect( init03 ).not.toThrow();
    expect( init04 ).not.toThrow();
    expect( init05 ).not.toThrow();
    expect( init06 ).not.toThrow();
    expect( init07 ).not.toThrow();
    expect( init08 ).not.toThrow();
    expect( init09 ).not.toThrow();
    expect( init10 ).not.toThrow();
    expect( init11 ).not.toThrow();
    expect( init12 ).not.toThrow();
    expect( init13 ).not.toThrow();
    expect( init14 ).not.toThrow();
    expect( init15 ).not.toThrow();
    expect( init16 ).not.toThrow();
    expect( init17 ).toThrow();
    expect( init18 ).toThrow();
    expect( init19 ).toThrow();
    expect( init20 ).not.toThrow();
  } );

  it( 'has two not implemented methods', () => {

    function call1() { rb.execute( 1 ); }
    function call2() { rb.result( 2 ); }

    expect( rb.execute ).toBeDefined();
    expect( rb.result ).toBeDefined();

    expect( call1 ).toThrow();
    expect( call2 ).toThrow();
  } );
} );
