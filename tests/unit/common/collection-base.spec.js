console.log( 'Testing common/collection-base.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const CollectionBase = read( 'common/collection-base.js' );
const events = require( 'events' );

describe( 'Collection base', () => {

  let collection, handlers, result;

  beforeEach( () => {

    result = null;
    handlers = {
      updated: function( user )
      {
        result = user;
      }
    };
    spyOn( handlers, 'updated' ).andCallThrough();

    collection = new CollectionBase();
    collection.on('updated', handlers.updated);
    collection.emit( 'updated', 'Ugly Kid Joe' );
  });

  it( 'is an event emitter', () => {

    expect( collection ).toEqual( jasmine.any( events.EventEmitter ) );
  } );

  it( 'events are called', () => {

    expect( handlers.updated ).toHaveBeenCalledWith( 'Ugly Kid Joe' );
  } );

  it( 'event handlers work', () => {

    expect( result ).toBe( 'Ugly Kid Joe' );
  } );
} );
