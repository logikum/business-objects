console.log( 'Testing data-access/dao-context.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const DaoContext = read( 'data-access/dao-context.js' );

describe( 'DAO context', () => {

  function fulfill( value ) {
    return value;
  }
  function reject( reason ) {
    return reason;
  }
  const connection = { name: 'Connection' };

  it( 'constructor expects three arguments', () => {
    function create01() { return new DaoContext(); }
    function create02() { return new DaoContext( 1, 2, 3 ); }
    function create03() { return new DaoContext( '1', '2', '3' ); }
    function create04() { return new DaoContext( fulfill ); }
    function create05() { return new DaoContext( fulfill, reject ); }
    function create06() { return new DaoContext( fulfill, reject, connection ); }
    function create07() { return new DaoContext( fulfill, null, connection ); }
    function create08() { return new DaoContext( fulfill, reject, null ); }
    function create09() { return new DaoContext( null, reject, connection ); }

    expect( create01 ).toThrow();
    expect( create02 ).toThrow();
    expect( create03 ).toThrow();
    expect( create04 ).toThrow();
    expect( create05 ).not.toThrow();
    expect( create06 ).not.toThrow();
    expect( create07 ).toThrow();
    expect( create08 ).not.toThrow();
    expect( create09 ).toThrow( 'The fulfill argument of DaoContext constructor must be a function.' );
  });

  it( 'has three read-only properties', () => {
    const ctx = new DaoContext( fulfill, reject, connection );

    expect( ctx.fulfill ).toBe( fulfill );
    expect( ctx.reject ).toBe( reject );
    expect( ctx.connection ).toBe( connection );

    ctx.fulfill = function() {};
    ctx.reject = function() {};
    ctx.connection = null;

    expect( ctx.fulfill ).toBe( fulfill );
    expect( ctx.reject ).toBe( reject );
    expect( ctx.connection ).toBe( connection );
  })
});
