
const _properties = new WeakMap();
const _store = new WeakMap();

function getPropertyValue( property ) {
  const store = _store.get( this );
  return store[ property ];
}

function setPropertyValue( property, value ) {
  const store = _store.get( this );
  store[ property ] = value;
  _store.set( this, store );
}

function sortProperties( comparer ) {
  const properties = _properties.get( this );
  properties.sort( comparer );
  _properties.set( this, properties );
}

class Private {

  constructor( properties ) {

    const store = {};
    properties.map( property => {
      store[ property ] = '';
    } );

    _properties.set( this, properties );
    _store.set( this, store );
  }

  get properties() {
    return _properties.get( this );
  }
  set properties( value ) {
    _properties.set( this, value );
  }

  get store() {
    return _store.get( this );
  }
  set store( value ) {
    _store.set( this, value );
  }

  sortProperties( comparer ) {
    sortProperties.call( this, comparer );
  }

  createProperties( target ) {

    this.properties.map( property => {

      Object.defineProperty( target, property, {
        get: () => {
          return getPropertyValue.call( this, property );
        },
        set: value => {
          setPropertyValue.call( this, property, value );
        },
        enumerable: true
      } );
    } );
  }
}

module.exports = Private;
