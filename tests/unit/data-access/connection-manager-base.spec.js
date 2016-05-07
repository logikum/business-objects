console.log( 'Testing main.js...' );

const ConnectionManagerBase = require( '../../../source/data-access/connection-manager-base.js' );

describe( 'Base connection manager', () => {
  let cm = null;
  const conn = {};

  it( 'constructor expects no arguments', () => {
    const build01 = function () {
      cm = new ConnectionManagerBase();
    };

    expect( build01 ).not.toThrow();
  } );

  it( 'has five not implemented methods', () => {
    function call1() { cm.openConnection( 'mongodb' ); }
    function call2() { cm.closeConnection( 'oracle', conn ); }
    function call3() { cm.beginTransaction( 'mysql' ); }
    function call4() { cm.commitTransaction( 'mssql', conn ); }
    function call5() { cm.rollbackTransaction( 'progress', conn ); }

    expect( cm.openConnection ).toEqual( jasmine.any( Function ) );
    expect( cm.closeConnection ).toEqual( jasmine.any( Function ) );
    expect( cm.beginTransaction ).toEqual( jasmine.any( Function ) );
    expect( cm.commitTransaction ).toEqual( jasmine.any( Function ) );
    expect( cm.rollbackTransaction ).toEqual( jasmine.any( Function ) );

    expect( call1 ).toThrow();
    expect( call2 ).toThrow();
    expect( call3 ).toThrow();
    expect( call4 ).toThrow();
    expect( call5 ).toThrow();
  } );
} );
