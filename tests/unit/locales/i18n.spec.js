console.log( 'Testing locales/i18n.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const i18n = read( 'locales/i18n.js' );

describe( 'Internationalization', () => {

  let currentLocale = '';
  function getLocale() { return currentLocale; }
  const pathOfLocales = '/locales';
  i18n.initialize( pathOfLocales, getLocale );

  it( 'constructor expects 0-2 arguments', () => {

    const build01 = function () { return new i18n(); };
    const build02 = function () { return new i18n( 'project' ); };
    const build03 = function () { return new i18n( undefined, 'type' ); };
    const build04 = function () { return new i18n( 'project', null ); };
    const build05 = function () { return new i18n( null, 'type' ); };
    const build06 = function () { return new i18n( 'project', '' ); };
    const build07 = function () { return new i18n( '', 'type' ); };
    const build08 = function () { return new i18n( 'project', 'type' ); };
    const build09 = function () { return new i18n( 1 ); };
    const build10 = function () { return new i18n( true ); };
    const build11 = function () { return new i18n( new Date( 2015, 1, 1 ) ); };
    const build12 = function () { return new i18n( [ 'project' ] ); };

    expect( build01 ).not.toThrow();
    expect( build02 ).not.toThrow();
    expect( build03 ).not.toThrow();
    expect( build04 ).not.toThrow();
    expect( build05 ).not.toThrow();
    expect( build06 ).not.toThrow();
    expect( build07 ).not.toThrow();
    expect( build08 ).not.toThrow();
    expect( build09 ).toThrow();
    expect( build10 ).toThrow();
    expect( build11 ).toThrow();
    expect( build12 ).toThrow();
  } );

  it( 'get method works wth simple key', () => {

    const i1 = new i18n();
    const i2 = new i18n( '$bo' );
    const i3 = new i18n( 'dashboard' );

    expect( i1.get( 'property1' ) ).toBe( 'value1' );
    expect( i1.get( '-invalid-key-' ) ).toBe( '-invalid-key-' );

    expect( i2.get( 'default' ) ).toBe( 'This is a test message.' );
    expect( i2.get( '-invalid-key-' ) ).toBe( '-invalid-key-' );

    expect( i3.get( 'manager' ) ).toBe( 'John Smith' );
    expect( i3.get( '-invalid-key-' ) ).toBe( '-invalid-key-' );
  } );

  it( 'getWithNs method works with namespace', () => {

    const i1 = new i18n();
    const i2 = new i18n( '$bo' );
    const i3 = new i18n( 'dashboard' );

    expect( i1.get( '$default:property1' ) ).toBe( 'value1' );
    expect( i1.get( '$default:-invalid-key-' ) ).toBe( '$default:-invalid-key-' );
    expect( i1.get( '$bo:default' ) ).toBe( 'This is a test message.' );
    expect( i1.get( 'dashboard:developer' ) ).toBe( 'Steve Jobs' );

    expect( i2.get( '$bo:default' ) ).toBe( 'This is a test message.' );
    expect( i2.get( '$bo:-invalid-key-' ) ).toBe( '$bo:-invalid-key-' );
    expect( i2.get( '$default:property2' ) ).toBe( 'value2' );
    expect( i2.get( 'dashboard:designer' ) ).toBe( 'Mary Poppins' );

    expect( i3.get( 'dashboard:manager' ) ).toBe( 'John Smith' );
    expect( i3.get( 'dashboard:-invalid-key-' ) ).toBe( 'dashboard:-invalid-key-' );
    expect( i3.get( '$default:property3' ) ).toBe( 'value3' );
    expect( i3.get( '$bo:default' ) ).toBe( 'This is a test message.' );
  } );

  it( 'get method works with parameter replacement', () => {

    const i1 = new i18n();

    expect( i1.get( 'pattern1', 'world' ) ).toBe( 'Hello, world!' );
    expect( i1.get( 'pattern2', 'Albert Einstein', 'scientist' ) ).toBe( 'Albert Einstein is a famous scientist.' );
    expect( i1.get( 'pattern3', 3, 7, 21 ) ).toBe( 'Result: 3 * 7 = 21' );
  } );

  it( 'get method works with extended keys', () => {

    const i1 = new i18n();
    const i2 = new i18n( null, 'capitols' );

    expect( i1.get( 'capitols.France' ) ).toBe( 'Paris' );
    expect( i1.get( 'capitols.Egypt' ) ).toBe( 'Cairo' );
    expect( i1.get( 'capitols.Japan' ) ).toBe( 'Tokyo' );

    expect( i1.get( 'capitols.USA.Texas' ) ).toBe( 'Austin' );
    expect( i1.get( 'capitols.USA.North Dakota' ) ).toBe( 'Bismarck' );
    expect( i1.get( 'capitols.USA.Utah' ) ).toBe( 'Salt Lake City' );

    expect( i2.get( 'France' ) ).toBe( 'Paris' );
    expect( i2.get( 'Egypt' ) ).toBe( 'Cairo' );
    expect( i2.get( 'Japan' ) ).toBe( 'Tokyo' );

    expect( i2.get( 'USA.Texas' ) ).toBe( 'Austin' );
    expect( i2.get( 'USA.North Dakota' ) ).toBe( 'Bismarck' );
    expect( i2.get( 'USA.Utah' ) ).toBe( 'Salt Lake City' );
  } );

  it( 'get method works with specific locale', () => {

    const i1 = new i18n();

    // Existing locale.
    currentLocale = 'hu-HU';

    expect( i1.get( 'capitols.France' ) ).toBe( 'Párizs' );
    expect( i1.get( 'capitols.Egypt' ) ).toBe( 'Kairó' );
    expect( i1.get( 'capitols.Japan' ) ).toBe( 'Tokió' );

    expect( i1.get( 'dashboard:manager' ) ).toBe( 'Kovács János' );
    expect( i1.get( 'dashboard:developer' ) ).toBe( 'Dolgos István' );
    expect( i1.get( 'dashboard:designer' ) ).toBe( 'Popper Mária' );

    // --- With overwritten locale.
    expect( i1.get( 'default*capitols.France' ) ).toBe( 'Paris' );
    expect( i1.get( 'default*dashboard:manager' ) ).toBe( 'John Smith' );
    expect( i1.get( 'fr*capitols.France' ) ).toBe( 'Paris' );
    expect( i1.get( 'fr*dashboard:manager' ) ).toBe( 'John Smith' );

    // Missing locale.
    currentLocale = 'fr';

    expect( i1.get( 'capitols.France' ) ).toBe( 'Paris' );
    expect( i1.get( 'capitols.Egypt' ) ).toBe( 'Cairo' );
    expect( i1.get( 'capitols.Japan' ) ).toBe( 'Tokyo' );

    expect( i1.get( 'dashboard:manager' ) ).toBe( 'John Smith' );
    expect( i1.get( 'dashboard:developer' ) ).toBe( 'Steve Jobs' );
    expect( i1.get( 'dashboard:designer' ) ).toBe( 'Mary Poppins' );

    // --- With overwritten locale.
    expect( i1.get( 'default*capitols.France' ) ).toBe( 'Paris' );
    expect( i1.get( 'default*dashboard:manager' ) ).toBe( 'John Smith' );
    expect( i1.get( 'hu-HU*capitols.France' ) ).toBe( 'Párizs' );
    expect( i1.get( 'hu-HU*dashboard:manager' ) ).toBe( 'Kovács János' );

    currentLocale = '';
  } );
} );
