console.log( 'Testing system/enumeration.js...' );

const UserInfo = require( '../../../source/system/user-info.js' );

describe( 'User info', () => {

  it( 'constructor expects one optional string argument', () => {
    function build01() { const user = new UserInfo( false ); }
    function build02() { const user = new UserInfo( 1 ); }
    function build03() { const user = new UserInfo( {} ); }
    function build04() { const user = new UserInfo( [] ); }
    function build05() { const user = new UserInfo( () => { } ); }
    function build06() { const user = new UserInfo( new Date() ); }
    function build07() { const user = new UserInfo( new RegExp( '[0-9]+' ) ); }

    expect( build01 ).toThrow();
    expect( build02 ).toThrow();
    expect( build03 ).toThrow();
    expect( build04 ).toThrow();
    expect( build05 ).toThrow();
    expect( build06 ).toThrow();
    expect( build07 ).toThrow();

    const user1 = new UserInfo();
    const user2 = new UserInfo( null );
    const user3 = new UserInfo( '' );
    const user4 = new UserInfo( 'Oriza Triznyák' );

    expect( user1.userCode ).toBe( null );
    expect( user2.userCode ).toBe( null );
    expect( user3.userCode ).toBe( '' );
    expect( user4.userCode ).toBe( 'Oriza Triznyák' );
  } );

  it( 'has one property', () => {
    const user = new UserInfo();
    user.userCode = 'Mirr-Murr';

    expect( user.userCode ).toBe( 'Mirr-Murr' );
  } );

  it( 'has one not implemented method', () => {
    const user = new UserInfo( 'Csizmás kandúr' );

    function use01() {
      const hasPermission = user.isInRole( 'drivers' );
    }

    expect( use01 ).toThrow( 'The UserInfo.isInRole method is not implemented.' );
  } );
} );
