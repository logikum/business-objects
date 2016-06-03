console.log( 'Testing shared/data-store.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const DataStore = read( 'shared/data-store.js' );
const PropertyInfo = read( 'shared/property-info.js' );
const F = read( 'shared/property-flag.js' );
const Text = read( 'data-types/text.js' );
const Integer = read( 'data-types/integer.js' );
const ModelBase = read( 'common/model-base.js' );

describe( 'Data store', () => {

  it( 'constructor expects no argument', () => {

    const build01 = function () { return new DataStore(); };

    expect( build01 ).not.toThrow();
  } );

  it( 'initValue method works', () => {

    const pm = new DataStore();
    const property = new PropertyInfo( 'name', new Text(), F.key );
    class TestModel extends ModelBase {
      constructor() {
        super();
        this.name = 'name';
        this.type = new Text();
        this.writable = true;
      }
    }
    const model = new TestModel();

    function initValue1() { pm.initValue(); }
    function initValue2() { pm.initValue( property ); }
    function initValue3() { pm.initValue( property, null ); }
    function initValue4() { pm.initValue( model, null ); }
    function initValue5() { pm.initValue( property, model ); }

    expect( initValue1 ).toThrow( 'The property argument of DataStore.initValue method must be a PropertyInfo object.' );
    expect( initValue2 ).not.toThrow();
    expect( initValue3 ).not.toThrow();
    expect( initValue4 ).toThrow();
    expect( initValue5 ).not.toThrow();
  } );

  it( 'getValue method works', () => {

    const pm = new DataStore();
    const property = new PropertyInfo( 'name', new Text() );
    const name = {
      name: 'name',
      type: new Text(),
      writable: true
    };
    pm.setValue( property, 'Ada Lovelace' );

    function getValue1() { const v = pm.getValue(); }
    function getValue2() { const v = pm.getValue( 6000 ); }
    function getValue3() { const v = pm.getValue( 'Ada Lovelace' ); }
    function getValue4() { const v = pm.getValue( true ); }
    function getValue5() { const v = pm.getValue( name ); }

    expect( getValue1 ).toThrow( 'The property argument of DataStore.getValue method must be a PropertyInfo object.' );
    expect( getValue2 ).toThrow();
    expect( getValue3 ).toThrow();
    expect( getValue4 ).toThrow();
    expect( getValue5 ).toThrow();
    expect( pm.getValue( property ) ).toBe( 'Ada Lovelace' );
  } );

  it( 'setValue method works', () => {

    const pm = new DataStore( 'list' );
    const property = new PropertyInfo( 'name', new Text() );
    const name = {
      name: 'name',
      type: new Text(),
      writable: true
    };

    function setValue1() { pm.setValue(); }
    function setValue2() { pm.setValue( property ); }
    function setValue3() { pm.setValue( 'Ada Lovelace' ); }
    function setValue4() { pm.setValue( property, 6000 ); }
    function setValue5() { pm.setValue( name, 'Ada Lovelace' ); }
    function setValue6() { pm.setValue( property, 'Ada Lovelace' ); }

    expect( setValue1 ).toThrow( 'The property argument of DataStore.setValue method must be a PropertyInfo object.' );
    expect( setValue2 ).toThrow();
    expect( setValue3 ).toThrow();
    expect( setValue4 ).not.toThrow();
    expect( setValue5 ).toThrow();
    expect( setValue6 ).not.toThrow();
  } );

  it( 'hasValidValue method works', () => {

    const pm = new DataStore( 'list' );
    const property = new PropertyInfo( 'price', new Integer() );
    const name = {
      name: 'price',
      type: new Integer(),
      writable: true
    };

    function setValue1() { pm.hasValidValue(); }
    function setValue2() { pm.hasValidValue( name ); }
    function setValue3() { pm.hasValidValue( 'Ada Lovelace' ); }
    function setValue4() { return pm.hasValidValue( property ); }

    expect( setValue1 ).toThrow( 'The property argument of DataStore.hasValidValue method must be a PropertyInfo object.' );
    expect( setValue2 ).toThrow();
    expect( setValue3 ).toThrow();
    expect( setValue4 ).not.toThrow();

    expect( pm.hasValidValue( property ) ).toBe( false );
    expect( pm.setValue( property, 'product' ) ).toBe( false );
    expect( pm.hasValidValue( property ) ).toBe( false );
    expect( pm.setValue( property, '123' ) ).toBe( true );
    expect( pm.hasValidValue( property ) ).toBe( true );
  } );
} );
