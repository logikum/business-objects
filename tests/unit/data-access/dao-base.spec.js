console.log( 'Testing data-access/dao-base.js...' );

const DaoBase = require( '../../../source/data-access/dao-base.js' );

describe('Base data access object', function () {

  it( 'constructor expects one argument', () => {
    function build01() { return new DaoBase(); }
    function build02() { return new DaoBase( 123.56 ); }
    function build03() { return new DaoBase( false ); }
    function build04() { return new DaoBase( new Date( 2014, 12, 12 )); }
    function build05() { return new DaoBase( { name: 'Africa' } ); }
    function build06() { return new DaoBase( [ 'name' ] ); }
    function build07() { return new DaoBase( '' ); }
    function build08() { return new DaoBase( 'name' ); }

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();
    expect( build08 ).not.toThrow();
  });

  it( 'has one property', () => {
    const dao = new DaoBase( 'Darts' );

    expect( dao.name ).toBe( 'Darts' );
  });

  it( '$runMethod method works', () => {
    const dao = new DaoBase( 'Sample' );
    dao.select = function () {};
    dao.count = 51;

    function check01() { dao.$runMethod(); }
    function check02() { dao.$runMethod( 51 ); }
    function check03() { dao.$runMethod( '' ); }
    function check04() { dao.$runMethod( 'create' ); }
    function check05() { dao.$runMethod( 'select' ); }
    function check06() { dao.$runMethod( 'count' ); }

    expect( check01 ).toThrow();
    expect( check02 ).toThrow();
    expect( check03 ).toThrow();
    expect( check04 ).toThrow();
    expect( check05 ).not.toThrow();
    expect( check06 ).toThrow();
  });

  it( '$hasCreate method works', () => {
    const dao1 = new DaoBase( 'Editable' );
    dao1.create = () => {};
    const dao2 = new DaoBase( 'Command' );
    dao2.execute = () => {};

    expect( dao1.$hasCreate() ).toBe( true );
    expect( dao2.$hasCreate() ).toBe( false );
  });
});
