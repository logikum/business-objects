console.log( 'Testing common/property-manager.js...' );

function read( filename ) {
  return require( '../../../source/' + filename );
}
const PropertyManager = read( 'common/property-manager.js' );
const PropertyInfo = read( 'common/property-info.js' );
const F = read( 'common/property-flag.js' );
const Text = read( 'data-types/text.js' );
const DateTime = read( 'data-types/date-time.js' );
const CollectionBase = read( 'common/collection-base.js' );
const ModelBase = read( 'common/model-base.js' );

describe( 'Property manager', () => {

  function getPropertyValue( property ) {
    return property.name;
  }

  it( 'constructor expects a non-empty string and optional properties', () => {

    const OrderList = new CollectionBase();
    const property1 = new PropertyInfo( 'name', new Text(), F.key );
    const property2 = new PropertyInfo( 'created', new DateTime(), F.readOnly );
    const property3 = new PropertyInfo( 'orders', OrderList );

    function create1() { return new PropertyManager(); }
    function create2() { return new PropertyManager( null ); }
    function create3() { return new PropertyManager( 1, 2 ); }
    function create4() { return new PropertyManager( 'customer', 1024 ); }
    function create5() { return new PropertyManager( 'customer', property1, false ); }
    function create6() { return new PropertyManager( '', property1 ); }
    function create7() { return new PropertyManager( property1 ); }
    function create8() { return new PropertyManager( property1, property2 ); }
    function create9() { return new PropertyManager( property1, property2, property3 ); }

    expect( create1 ).not.toThrow();
    expect( create2 ).toThrow( 'All arguments of PropertyManager constructor must be a PropertyInfo object.' );
    expect( create3 ).toThrow();
    expect( create4 ).toThrow();
    expect( create5 ).toThrow();
    expect( create6 ).toThrow();
    expect( create7 ).not.toThrow();
    expect( create8 ).not.toThrow();
    expect( create9 ).not.toThrow();
  } );

  it( 'has modelName property', () => {

    const pm = new PropertyManager();
    expect( pm.modelName ).toBe( 'PropertyManager' );

    pm.modelName = 'model';
    expect( pm.modelName ).toBe( 'model' );

    function set01() { pm.modelName = 3.14; }
    expect( set01 ).toThrow( 'The value of PropertyManager.modelName property must be a non-empty string.' );
  } );

  //region Item management

  it( 'add method works', () => {

    const pm = new PropertyManager();

    function add1() {
      const email = {
        name: 'email',
        type: new Text(),
        writable: true
      };
      pm.add( email );
    }
    function add2() {
      const email = new PropertyInfo( 'email', new Text(), F.readOnly );
      pm.add( email );
    }

    expect( add1 ).toThrow( 'The property argument of PropertyManager.add method must be a PropertyInfo object.' );
    expect( add2 ).not.toThrow();
  } );

  it( 'create method works', () => {

    const pm = new PropertyManager();
    const property = pm.create( 'name', new Text() );

    expect( property ).toEqual( jasmine.any( PropertyInfo ) );
  } );

  it( 'contains method works', () => {

    const propertyName = new PropertyInfo( 'name', new Text(), F.key | F.onDtoOnly );
    const propertyEmail = new PropertyInfo( 'email', new Text() );
    const pm = new PropertyManager( propertyName );

    function contains1() {
      const email = {
        name: 'email',
        type: new Text(),
        writable: true
      };
      const exists = pm.contains( email );
    }

    expect( contains1 ).toThrow( 'The property argument of PropertyManager.contains method must be a PropertyInfo object.' );
    expect( pm.contains( propertyEmail ) ).toBe( false );
    expect( pm.contains( propertyName ) ).toBe( true );
  } );

  it( 'getByName method works', () => {

    const pm = new PropertyManager();
    const property = pm.create( 'name', new Text() );

    function getByName1() { const p = pm.getByName(); }
    function getByName2() { const p = pm.getByName( null ); }
    function getByName3() { const p = pm.getByName( 1 ); }
    function getByName4() { const p = pm.getByName( '' ); }
    function getByName5() { const p = pm.getByName( 'email' ); }
    function getByName6() { const p = pm.getByName( 'email', 'Ooops!' ); }

    const result = pm.getByName( 'name' );

    expect( getByName1 ).toThrow( 'The name argument of PropertyManager.getByName method must be a non-empty string.' );
    expect( getByName2 ).toThrow();
    expect( getByName3 ).toThrow();
    expect( getByName4 ).toThrow();
    expect( getByName5 ).toThrow();
    expect( getByName6 ).toThrow( 'Ooops!' );
    expect( result ).toBe( property );
  } );

  it( 'toArray method works', () => {

    const propertyName = new PropertyInfo( 'name', new Text(), F.key );
    const propertyEmail = new PropertyInfo( 'email', new Text(), F.readOnly );
    const pm = new PropertyManager( propertyName, propertyEmail );

    const properties = pm.toArray();

    expect( properties ).toEqual( jasmine.any( Array ) );
    expect( properties.length ).toBe( 2 );
    expect( properties[ 0 ] ).toBe( propertyName );
    expect( properties[ 1 ] ).toBe( propertyEmail );
  } );

  //endregion

  //region Public array methods

  it( 'forEach method works', () => {

    const propertyName = new PropertyInfo( 'name', new Text(), F.key );
    const propertyEmail = new PropertyInfo( 'email', new Text(), F.readOnly );
    const pm = new PropertyManager( propertyName, propertyEmail );
    let count = 0;
    let names = '';

    pm.forEach( item => {
      names += names === '' ? item.name : ', ' + item.name;
      count++;
    } );

    expect( count ).toBe( 2 );
    expect( names ).toBe( 'name, email' );
  } );

  it( 'filter method works', () => {

    const propertyName = new PropertyInfo( 'name', new Text(), F.key );
    const propertyEmail = new PropertyInfo( 'email', new Text(), F.readOnly );
    const pm = new PropertyManager( propertyName, propertyEmail );

    const names = pm.filter( item => {
      return item.isReadOnly;
    } );

    expect( names.length ).toBe( 1 );
    expect( names[ 0 ] ).toBe( propertyEmail );
  } );

  it( 'map method works', () => {

    const propertyName = new PropertyInfo( 'name', new Text(), F.key );
    const propertyEmail = new PropertyInfo( 'email', new Text(), F.readOnly );
    const pm = new PropertyManager( propertyName, propertyEmail );

    const names = pm.map( function ( item ) {
      return item.name;
    } );

    expect( names.length ).toBe( 2 );
    expect( names[ 0 ] ).toBe( 'name' );
    expect( names[ 1 ] ).toBe( 'email' );
  } );

  //endregion

  //region Children

  it( 'children and childCount methods work', () => {

    const OrderList = new CollectionBase();
    const name = new PropertyInfo( 'name', new Text() );
    const orders = new PropertyInfo( 'orders', OrderList );
    const created = new PropertyInfo( 'created', new DateTime() );
    const pm = new PropertyManager( name, orders, created );

    expect( pm.children() ).toEqual( jasmine.any( Array ) );
    expect( pm.children().length ).toBe( 1 );
    expect( pm.children()[ 0 ] ).toEqual( orders );
    expect( pm.children()[ 0 ].name ).toBe( 'orders' );
    expect( pm.childCount() ).toBe( 1 );

    const Address = new ModelBase();
    const address = new PropertyInfo( 'address', Address );
    pm.add( address );

    expect( pm.children() ).toEqual( jasmine.any( Array ) );
    expect( pm.children().length ).toBe( 2 );
    expect( pm.children()[ 1 ] ).toEqual( address );
    expect( pm.children()[ 1 ].name ).toBe( 'address' );
    expect( pm.childCount() ).toBe( 2 );

    const Account = new ModelBase();
    const account = pm.create( 'account', Account );

    expect( pm.children() ).toEqual( jasmine.any( Array ) );
    expect( pm.children().length ).toBe( 3 );
    expect( pm.children()[ 2 ] ).toEqual( account );
    expect( pm.children()[ 2 ].name ).toBe( 'account' );
    expect( pm.childCount() ).toBe( 3 );
  } );

  it( 'verifyChildTypes method works', () => {

    const OrderList = new CollectionBase();
    const name = new PropertyInfo( 'name', new Text() );
    const orders = new PropertyInfo( 'orders', OrderList );
    const created = new PropertyInfo( 'created', new DateTime() );
    const pm = new PropertyManager( name, orders, created );

    const Address = new ModelBase();
    const address = new PropertyInfo( 'address', Address );
    pm.add( address );

    const verify1 = function () { pm.verifyChildTypes( Array ); };
    const verify2 = function () { pm.verifyChildTypes( 'Array' ); };

    expect( verify1 ).toThrow( 'The allowedTypes argument of PropertyManager.verifyChildTypes method must be an array of String values or a single String value.' );
    expect( verify2 ).toThrow( 'The model type of orders property of PropertyManager is object, but it should be Array.' );
  } );

  //endregion

  //region Key

  it( 'getKey method works - no keys', () => {

    const Figures = new CollectionBase();
    const one = new PropertyInfo( 'uno', new Text() );
    const two = new PropertyInfo( 'due', Figures );
    const three = new PropertyInfo( 'tre', new Text() );
    const four = new PropertyInfo( 'quattro', new Text() );
    const pm = new PropertyManager( one, two, three, four );

    const object = {
      uno: 'uno',
      tre: 'tre',
      quattro: 'quattro'
    };

    const key = pm.getKey( getPropertyValue );
    function get01() { const k = pm.getKey( 1024 ); };

    expect( key ).toEqual( object );
    expect( get01 ).toThrow( 'The getPropertyValue argument of PropertyManager.getKey method must be a function.' );
  } );

  it( 'getKey method works - one key', () => {

    const Figures = new CollectionBase();
    const one = new PropertyInfo( 'uno', new Text() );
    const two = new PropertyInfo( 'due', Figures );
    const three = new PropertyInfo( 'tre', new Text(), F.key );
    const four = new PropertyInfo( 'quattro', new Text() );
    const pm = new PropertyManager( one, two, three, four );

    const key = pm.getKey( getPropertyValue );

    expect( key ).toBe( 'tre' );
  } );

  it( 'getKey method works - more keys', () => {

    const Figures = new CollectionBase();
    const one = new PropertyInfo( 'uno', new Text(), F.key );
    const two = new PropertyInfo( 'due', Figures );
    const three = new PropertyInfo( 'tre', new Text() );
    const four = new PropertyInfo( 'quattro', new Text(), F.key );
    const pm = new PropertyManager( one, two, three, four );

    const object = {
      uno: 'uno',
      quattro: 'quattro'
    };

    const key = pm.getKey( getPropertyValue );

    expect( key ).toEqual( object );
  } );

  it( 'getKey method works - no properties', () => {

    const pm = new PropertyManager();
    const key = pm.getKey( getPropertyValue );

    expect( key ).toBeUndefined();
  } );

  it( 'keyEquals method works', () => {

    const code = new PropertyInfo( 'code', new Text(), F.key );
    const name = new PropertyInfo( 'name', new Text() );
    const pm = new PropertyManager( code, name );

    function equals01() { const eq = pm.keyEquals( 'code' ); }

    expect( pm.keyEquals( { code: 'code' }, getPropertyValue ) ).toBe( true );
    expect( equals01 ).toThrow( 'The data argument of PropertyManager.keyEquals method must be an object.' );
  } );

  //endregion
} );
