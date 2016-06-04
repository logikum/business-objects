console.log( 'Testing common/data-portal-event.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const DataPortalEvent = read( 'common/data-portal-event.js' );

describe( 'Data portal event enumeration', () => {

  it( '$name property returns the type name', () => {

    expect( DataPortalEvent.$name ).toBe( 'DataPortalEvent' );
  } );

  it( 'has the defined items', () => {

    expect( DataPortalEvent.preFetch ).toBe( 0 );
    expect( DataPortalEvent.postFetch ).toBe( 1 );
    expect( DataPortalEvent.preCreate ).toBe( 2 );
    expect( DataPortalEvent.postCreate ).toBe( 3 );
    expect( DataPortalEvent.preInsert ).toBe( 4 );
    expect( DataPortalEvent.postInsert ).toBe( 5 );
    expect( DataPortalEvent.preUpdate ).toBe( 6 );
    expect( DataPortalEvent.postUpdate ).toBe( 7 );
    expect( DataPortalEvent.preRemove ).toBe( 8 );
    expect( DataPortalEvent.postRemove ).toBe( 9 );
    expect( DataPortalEvent.preExecute ).toBe( 10 );
    expect( DataPortalEvent.postExecute ).toBe( 11 );
    expect( DataPortalEvent.preSave ).toBe( 12 );
    expect( DataPortalEvent.postSave ).toBe( 13 );
  } );

  it( 'count method returns the item count', () => {

    expect( DataPortalEvent.count() ).toBe( 14 );
  } );

  it( 'getName method returns the item name', () => {

    expect( DataPortalEvent.getName( 0 ) ).toBe( 'preFetch' );
    expect( DataPortalEvent.getName( 1 ) ).toBe( 'postFetch' );
    expect( DataPortalEvent.getName( 2 ) ).toBe( 'preCreate' );
    expect( DataPortalEvent.getName( 3 ) ).toBe( 'postCreate' );
    expect( DataPortalEvent.getName( 4 ) ).toBe( 'preInsert' );
    expect( DataPortalEvent.getName( 5 ) ).toBe( 'postInsert' );
    expect( DataPortalEvent.getName( 6 ) ).toBe( 'preUpdate' );
    expect( DataPortalEvent.getName( 7 ) ).toBe( 'postUpdate' );
    expect( DataPortalEvent.getName( 8 ) ).toBe( 'preRemove' );
    expect( DataPortalEvent.getName( 9 ) ).toBe( 'postRemove' );
    expect( DataPortalEvent.getName( 10 ) ).toBe( 'preExecute' );
    expect( DataPortalEvent.getName( 11 ) ).toBe( 'postExecute' );
    expect( DataPortalEvent.getName( 12 ) ).toBe( 'preSave' );
    expect( DataPortalEvent.getName( 13 ) ).toBe( 'postSave' );
  } );

  it( 'getValue method returns the item value', () => {

    expect( DataPortalEvent.getValue( 'preFetch' ) ).toBe( 0 );
    expect( DataPortalEvent.getValue( 'postFetch' ) ).toBe( 1 );
    expect( DataPortalEvent.getValue( 'preCreate' ) ).toBe( 2 );
    expect( DataPortalEvent.getValue( 'postCreate' ) ).toBe( 3 );
    expect( DataPortalEvent.getValue( 'preInsert' ) ).toBe( 4 );
    expect( DataPortalEvent.getValue( 'postInsert' ) ).toBe( 5 );
    expect( DataPortalEvent.getValue( 'preUpdate' ) ).toBe( 6 );
    expect( DataPortalEvent.getValue( 'postUpdate' ) ).toBe( 7 );
    expect( DataPortalEvent.getValue( 'preRemove' ) ).toBe( 8 );
    expect( DataPortalEvent.getValue( 'postRemove' ) ).toBe( 9 );
    expect( DataPortalEvent.getValue( 'preExecute' ) ).toBe( 10 );
    expect( DataPortalEvent.getValue( 'postExecute' ) ).toBe( 11 );
    expect( DataPortalEvent.getValue( 'preSave' ) ).toBe( 12 );
    expect( DataPortalEvent.getValue( 'postSave' ) ).toBe( 13 );
  } );

  it( 'check method inspects a value', () => {

    function check01() {DataPortalEvent.check( -1 ); }
    function check02() {DataPortalEvent.check( DataPortalEvent.preFetch ); }
    function check03() {DataPortalEvent.check( DataPortalEvent.postFetch ); }
    function check04() {DataPortalEvent.check( DataPortalEvent.preCreate ); }
    function check05() {DataPortalEvent.check( DataPortalEvent.postCreate ); }
    function check06() {DataPortalEvent.check( DataPortalEvent.preInsert ); }
    function check07() {DataPortalEvent.check( DataPortalEvent.postInsert ); }
    function check08() {DataPortalEvent.check( DataPortalEvent.preUpdate ); }
    function check09() {DataPortalEvent.check( DataPortalEvent.postUpdate ); }
    function check10() {DataPortalEvent.check( DataPortalEvent.preRemove ); }
    function check11() {DataPortalEvent.check( DataPortalEvent.postRemove ); }
    function check12() {DataPortalEvent.check( DataPortalEvent.preExecute ); }
    function check13() {DataPortalEvent.check( DataPortalEvent.postExecute ); }
    function check14() {DataPortalEvent.check( DataPortalEvent.preSave ); }
    function check15() {DataPortalEvent.check( DataPortalEvent.postSave ); }
    function check16() {DataPortalEvent.check( 14 ); }

    expect( check01 ).toThrow();
    expect( check02 ).not.toThrow();
    expect( check03 ).not.toThrow();
    expect( check04 ).not.toThrow();
    expect( check05 ).not.toThrow();
    expect( check06 ).not.toThrow();
    expect( check07 ).not.toThrow();
    expect( check08 ).not.toThrow();
    expect( check09 ).not.toThrow();
    expect( check10 ).not.toThrow();
    expect( check11 ).not.toThrow();
    expect( check12 ).not.toThrow();
    expect( check13 ).not.toThrow();
    expect( check14 ).not.toThrow();
    expect( check15 ).not.toThrow();
    expect( check16 ).toThrow();
  } );
} );
