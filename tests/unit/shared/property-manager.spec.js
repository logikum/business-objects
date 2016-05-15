console.log('Testing shared/property-manager.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var PropertyManager = read( 'shared/property-manager.js');
var PropertyInfo = read( 'shared/property-info.js');
var F = read( 'shared/property-flag.js');
var Text = read( 'data-types/text.js');
var DateTime = read( 'data-types/date-time.js');
var CollectionBase = read( 'collection-base.js');
var ModelBase = read( 'model-base.js');

describe('Property manager', function () {
  function getPropertyValue (property) {
    return property.name;
  }

  it('constructor expects a non-empty string and optional properties', function() {
    var OrderList = new CollectionBase();
    var property1 = new PropertyInfo('name', new Text(), F.key);
    var property2 = new PropertyInfo('created', new DateTime(), F.readOnly);
    var property3 = new PropertyInfo('orders', OrderList);

    function create1() { return new PropertyManager(); }
    function create2() { return new PropertyManager(null); }
    function create3() { return new PropertyManager(1, 2); }
    function create4() { return new PropertyManager('customer', 1024); }
    function create5() { return new PropertyManager('customer', property1, false); }
    function create6() { return new PropertyManager('', property1); }
    function create7() { return new PropertyManager(property1); }
    function create8() { return new PropertyManager(property1, property2); }
    function create9() { return new PropertyManager(property1, property2, property3); }

    expect(create1).not.toThrow();
    expect(create2).toThrow();
    expect(create3).toThrow();
    expect(create4).toThrow();
    expect(create5).toThrow();
    expect(create6).toThrow();
    expect(create7).not.toThrow();
    expect(create8).not.toThrow();
    expect(create9).not.toThrow();
  });

  it('has modelName property', function() {
    var pm = new PropertyManager();
    expect(pm.modelName).toBe('PropertyManager');

    pm.modelName = 'model';
    expect(pm.modelName).toBe('model');
  });

  //region Item management

  it('add method works', function() {
    var pm = new PropertyManager();

    function add1() {
      var email = {
        name: 'email',
        type: new Text(),
        writable: true
      };
      pm.add(email);
    }
    function add2() {
      var email = new PropertyInfo('email', new Text(), F.readOnly);
      pm.add(email);
    }

    expect(add1).toThrow();
    expect(add2).not.toThrow();
  });

  it('create method works', function() {
    var pm = new PropertyManager();
    var property = pm.create('name', new Text());

    expect(property).toEqual(jasmine.any(PropertyInfo));
  });

  it('contains method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key | F.onDtoOnly);
    var propertyEmail = new PropertyInfo('email', new Text());
    var pm = new PropertyManager(propertyName);

    function contains1() {
      var email = {
        name: 'email',
        type: new Text(),
        writable: true
      };
      var exists = pm.contains(email);
    }

    expect(contains1).toThrow();
    expect(pm.contains(propertyEmail)).toBe(false);
    expect(pm.contains(propertyName)).toBe(true);
  });

  it('getByName method works', function() {
    var pm = new PropertyManager();
    var property = pm.create('name', new Text());

    function getByName1() { var p = pm.getByName(); }
    function getByName2() { var p = pm.getByName(null); }
    function getByName3() { var p = pm.getByName(1); }
    function getByName4() { var p = pm.getByName(''); }
    function getByName5() { var p = pm.getByName('email'); }
    function getByName6() { var p = pm.getByName('email', 'Ooops!'); }

    var result = pm.getByName('name');

    expect(getByName1).toThrow();
    expect(getByName2).toThrow();
    expect(getByName3).toThrow();
    expect(getByName4).toThrow();
    expect(getByName5).toThrow();
    expect(getByName6).toThrow('Ooops!');
    expect(result).toBe(property);
  });

  it('toArray method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key);
    var propertyEmail = new PropertyInfo('email', new Text(), F.readOnly);
    var pm = new PropertyManager(propertyName, propertyEmail);

    var properties = pm.toArray();

    expect(properties).toEqual(jasmine.any(Array));
    expect(properties.length).toBe(2);
    expect(properties[0]).toBe(propertyName);
    expect(properties[1]).toBe(propertyEmail);
  });

  //endregion

  //region Public array methods

  it('forEach method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key);
    var propertyEmail = new PropertyInfo('email', new Text(), F.readOnly);
    var pm = new PropertyManager(propertyName, propertyEmail);
    var count = 0;
    var names = '';

    pm.forEach(function (item) {
      names += names === '' ? item.name : ', ' + item.name;
      count++;
    });

    expect(count).toBe(2);
    expect(names).toBe('name, email');
  });

  it('filter method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key);
    var propertyEmail = new PropertyInfo('email', new Text(), F.readOnly);
    var pm = new PropertyManager(propertyName, propertyEmail);

    var names = pm.filter(function (item) {
      return item.isReadOnly;
    });

    expect(names.length).toBe(1);
    expect(names[0]).toBe(propertyEmail);
  });

  it('map method works', function() {
    var propertyName = new PropertyInfo('name', new Text(), F.key);
    var propertyEmail = new PropertyInfo('email', new Text(), F.readOnly);
    var pm = new PropertyManager(propertyName, propertyEmail);

    var names = pm.map(function (item) {
      return item.name;
    });

    expect(names.length).toBe(2);
    expect(names[0]).toBe('name');
    expect(names[1]).toBe('email');
  });

  //endregion

  //region Children

  it('children and childCount methods work', function() {
    var OrderList = new CollectionBase();
    var name = new PropertyInfo('name', new Text());
    var orders = new PropertyInfo('orders', OrderList);
    var created = new PropertyInfo('created', new DateTime());
    var pm = new PropertyManager(name, orders, created);

    expect(pm.children()).toEqual(jasmine.any(Array));
    expect(pm.children().length).toBe(1);
    expect(pm.children()[0]).toEqual(orders);
    expect(pm.children()[0].name).toBe('orders');
    expect(pm.childCount()).toBe(1);

    var Address = new ModelBase();
    var address = new PropertyInfo('address', Address);
    pm.add(address);

    expect(pm.children()).toEqual(jasmine.any(Array));
    expect(pm.children().length).toBe(2);
    expect(pm.children()[1]).toEqual(address);
    expect(pm.children()[1].name).toBe('address');
    expect(pm.childCount()).toBe(2);

    var Account = new ModelBase();
    var account = pm.create('account', Account);

    expect(pm.children()).toEqual(jasmine.any(Array));
    expect(pm.children().length).toBe(3);
    expect(pm.children()[2]).toEqual(account);
    expect(pm.children()[2].name).toBe('account');
    expect(pm.childCount()).toBe(3);
  });

  it('verifyChildTypes method works', function() {

  });

  //endregion

  //region Key

  it('getKey method works - no keys', function() {
    var Figures = new CollectionBase();
    var one = new PropertyInfo('uno', new Text());
    var two = new PropertyInfo('due', Figures);
    var three = new PropertyInfo('tre', new Text());
    var four = new PropertyInfo('quattro', new Text());
    var pm = new PropertyManager(one, two, three, four);

    var object = {
      uno: 'uno',
      tre: 'tre',
      quattro: 'quattro'
    };

    var key = pm.getKey(getPropertyValue);

    expect(key).toEqual(object);
  });

  it('getKey method works - one key', function() {
    var Figures = new CollectionBase();
    var one = new PropertyInfo('uno', new Text());
    var two = new PropertyInfo('due', Figures);
    var three = new PropertyInfo('tre', new Text(), F.key);
    var four = new PropertyInfo('quattro', new Text());
    var pm = new PropertyManager(one, two, three, four);

    var key = pm.getKey(getPropertyValue);

    expect(key).toBe('tre');
  });

  it('getKey method works - more keys', function() {
    var Figures = new CollectionBase();
    var one = new PropertyInfo('uno', new Text(), F.key);
    var two = new PropertyInfo('due', Figures);
    var three = new PropertyInfo('tre', new Text());
    var four = new PropertyInfo('quattro', new Text(), F.key);
    var pm = new PropertyManager(one, two, three, four);

    var object = {
      uno: 'uno',
      quattro: 'quattro'
    };

    var key = pm.getKey(getPropertyValue);

    expect(key).toEqual(object);
  });

  it('getKey method works - no properties', function() {
    var pm = new PropertyManager();

    var key = pm.getKey(getPropertyValue);

    expect(key).toBeUndefined();
  });

  //endregion
});
