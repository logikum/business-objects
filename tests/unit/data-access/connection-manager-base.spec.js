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

    expect( call1 ).toThrow( 'The ConnectionManagerBase.openConnection method is not implemented.' );
    expect( call2 ).toThrow( 'The ConnectionManagerBase.closeConnection method is not implemented.' );
    expect( call3 ).toThrow( 'The ConnectionManagerBase.beginTransaction method is not implemented.' );
    expect( call4 ).toThrow( 'The ConnectionManagerBase.commitTransaction method is not implemented.' );
    expect( call5 ).toThrow( 'The ConnectionManagerBase.rollbackTransaction method is not implemented.' );
  } );
} );
