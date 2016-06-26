const Private = require( './private.js' );

const _private = new WeakMap();

class Model {
  
  constructor( properties ) {

    const $ = new Private( properties );

    _private.set( this, $ );
    
    $.createProperties( this );
  }
  
  listProperties( sortBefore ) {
    const $ = _private.get( this );
    if (sortBefore)
      $.sortProperties();
    console.log( $.properties );
  }
}

module.exports = Model;
