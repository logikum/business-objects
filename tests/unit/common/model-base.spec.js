console.log( 'Testing common/model-base.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const ModelBase = read( 'common/model-base.js' );
const events = require( 'events' );

describe( 'Model base', () => {

  let model, handlers, result;

  beforeEach( () => {

    result = null;
    handlers = {
      childHasChanged: function( user )
      {
        result = user;
      }
    };
    spyOn( handlers, 'childHasChanged' ).andCallThrough();

    model = new ModelBase();
    model.on( 'childHasChanged', handlers.childHasChanged );
    model.emit( 'childHasChanged', 'Nice Boy Bob' );
  });

  it( 'is an event emitter', () => {

    expect( model ).toEqual( jasmine.any( events.EventEmitter ) );
  } );

  it( 'events are called', () => {

    expect( handlers.childHasChanged ).toHaveBeenCalledWith( 'Nice Boy Bob' );
  } );

  it( 'event handlers work', () => {

    expect( result ).toBe( 'Nice Boy Bob' );
  } );
} );
