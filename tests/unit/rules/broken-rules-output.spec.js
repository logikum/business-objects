console.log( 'Testing rules/broken-rules-output.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}

const BrokenRulesOutput = read( 'rules/broken-rules-output.js' );
const RuleNotice = read( 'rules/rule-notice.js' );
const RuleSeverity = read( 'rules/rule-severity.js' );

describe( 'Broken rules output', () => {

  it( 'constructor expects no argument', () => {

    const build01 = function () { return new BrokenRulesOutput(); };

    expect( build01 ).not.toThrow();
  } );

  it( 'has read-only $length property', () => {

    const bro = new BrokenRulesOutput();
    const notice = new RuleNotice( 'message', RuleSeverity.error );

    expect( bro.$length ).toBe( 0 );

    bro.add( 'property', notice );

    expect( bro.$length ).toBe( 1 );

    bro.$length = 99;

    expect( bro.$length ).toBe( 1 );
  } );

  it( 'has read-only $count property', () => {

    const bro = new BrokenRulesOutput();
    const notice = new RuleNotice( 'message', RuleSeverity.error );

    expect( bro.$count ).toBe( 0 );

    bro.add( 'property', notice );

    expect( bro.$count ).toBe( 1 );

    bro.$count = 99;

    expect( bro.$count ).toBe( 1 );
  } );

  it( 'has $index property', () => {

    const bro = new BrokenRulesOutput();

    expect( bro.$index ).toBeNull();

    bro.$index = 1001;

    expect( bro.$index ).toBe( 1001 );
  } );

  it( 'add method expects two non-empty string and a severity argument', () => {

    const bro = new BrokenRulesOutput();
    const notice = new RuleNotice( 'message', RuleSeverity.error );

    const add01 = function () { bro.add(); };
    const add02 = function () { bro.add( 'property' ); };
    const add03 = function () { bro.add( notice ); };
    const add04 = function () { bro.add( notice, 'property' ); };
    const add05 = function () { bro.add( '', notice ); };
    const add06 = function () { bro.add( 'message', RuleSeverity.error ); };
    const add07 = function () { bro.add( 'property', notice ); };
    const add08 = function () { bro.add( null, null ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).toThrow();
    expect( add05 ).toThrow();
    expect( add06 ).toThrow();
    expect( add07 ).not.toThrow();
    expect( add08 ).toThrow();
  } );

  it( 'add method creates an array property', () => {

    const bro = new BrokenRulesOutput();
    bro.add( 'property', new RuleNotice( 'message #1', RuleSeverity.information ) );
    bro.add( 'property', new RuleNotice( 'message #2', RuleSeverity.error ) );

    expect( bro.property ).toEqual( jasmine.any( Array ) );
    expect( bro.property[ 0 ].message ).toBe( 'message #1' );
    expect( bro.property[ 0 ].severity ).toBe( RuleSeverity.information );
    expect( bro.property[ 1 ].message ).toBe( 'message #2' );
    expect( bro.property[ 1 ].severity ).toBe( RuleSeverity.error );
  } );

  it( 'addChild method expects two arguments', () => {

    const bro = new BrokenRulesOutput();
    const broChild = new BrokenRulesOutput();

    const add01 = function () { bro.addChild(); };
    const add02 = function () { bro.addChild( 'property' ); };
    const add03 = function () { bro.addChild( 'property', 'message' ); };
    const add04 = function () { bro.addChild( 'property', broChild ); };
    const add05 = function () { bro.addChild( broChild ); };
    const add06 = function () { bro.addChild( broChild, 'property' ); };
    const add07 = function () { bro.addChild( '', broChild ); };
    const add08 = function () { bro.addChild( 1, broChild ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).not.toThrow();
    expect( add05 ).toThrow();
    expect( add06 ).toThrow();
    expect( add07 ).toThrow();
    expect( add08 ).toThrow();
  } );

  it( 'addItem method expects two arguments', () => {

    const bro = new BrokenRulesOutput();
    const broChild = new BrokenRulesOutput();

    const add01 = function () { bro.addItem(); };
    const add02 = function () { bro.addItem( 777 ); };
    const add03 = function () { bro.addItem( 10, 20 ); };
    const add04 = function () { bro.addItem( 'property', broChild ); };
    const add05 = function () { bro.addItem( broChild ); };
    const add06 = function () { bro.addItem( broChild, 128 ); };
    const add07 = function () { bro.addItem( '', broChild ); };
    const add08 = function () { bro.addItem( 1, broChild ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).toThrow();
    expect( add05 ).toThrow();
    expect( add06 ).toThrow();
    expect( add07 ).toThrow();
    expect( add08 ).not.toThrow();
  } );

  it( 'addChildren method expects two arguments', () => {

    const bro = new BrokenRulesOutput();
    const broChild = new BrokenRulesOutput();
    broChild.$index = 7;
    const broChildren = [ broChild ];

    const add01 = function () { bro.addChildren(); };
    const add02 = function () { bro.addChildren( 'property' ); };
    const add03 = function () { bro.addChildren( 'property', 'message' ); };
    const add04 = function () { bro.addChildren( 'property', broChild ); };
    const add05 = function () { bro.addChildren( 'property', broChildren ); };
    const add06 = function () { bro.addChildren( broChildren, 'property' ); };
    const add07 = function () { bro.addChildren( broChildren ); };
    const add08 = function () { bro.addChildren( true, broChildren ); };

    expect( add01 ).toThrow();
    expect( add02 ).toThrow();
    expect( add03 ).toThrow();
    expect( add04 ).not.toThrow();
    expect( add05 ).not.toThrow();
    expect( add06 ).toThrow();
    expect( add07 ).toThrow();
    expect( add08 ).toThrow();
  } );
} );
