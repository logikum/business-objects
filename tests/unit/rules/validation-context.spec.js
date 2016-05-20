console.log( 'Testing rules/validation-context.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const ValidationContext = read( 'rules/validation-context.js' );
const BrokenRuleList = read( 'rules/broken-rule-list.js' );
const DataStore = read( 'shared/data-store.js' );

describe( 'Validation context', () => {

  function getValue() { }
  const brokenRules = new BrokenRuleList( 'modelName' );

  it( 'constructor expects two arguments', () => {

    const build01 = function () { return new ValidationContext(); };
    const build02 = function () { return new ValidationContext( {} ); };
    const build03 = function () { return new ValidationContext( [], {} ); };
    const build04 = function () { return new ValidationContext( getValue, brokenRules ); };
    const build05 = function () { return new ValidationContext( new DataStore(), 'brokenRules' ); };
    const build06 = function () { return new ValidationContext( new DataStore(), brokenRules ); };
    const build07 = function () { return new ValidationContext( new DataStore() ); };
    const build08 = function () { return new ValidationContext( null, null ); };

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).toThrow();
  } );

  it( 'has two properties', () => {

    const ctx = new ValidationContext( new DataStore(), brokenRules );

    expect( ctx.getValue ).toEqual( jasmine.any( Function ) );
    expect( ctx.brokenRules ).toBe( brokenRules );
  } );

  it( 'has read-only properties', () => {

    const ctx = new ValidationContext( new DataStore(), brokenRules );
    ctx.getValue = null;
    ctx.brokenRules = null;

    expect( ctx.getValue ).not.toBeNull();
    expect( ctx.brokenRules ).not.toBeNull();
  } );
} );
