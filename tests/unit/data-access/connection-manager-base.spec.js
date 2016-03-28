console.log('Testing main.js...');

var ConnectionManagerBase = require('../../../source/data-access/connection-manager-base.js');

describe('Base connection manager', function () {
  var cm = null;
  var conn = {};

  it('constructor expects no arguments', function () {
    var build01 = function () { cm = new ConnectionManagerBase(); };

    expect(build01).not.toThrow();
  });

  it('has five not implemented methods', function() {
    function call1() { cm.openConnection('mongodb'); }
    function call2() { cm.closeConnection('oracle', conn); }
    function call3() { cm.beginTransaction('mysql'); }
    function call4() { cm.commitTransaction('mssql', conn); }
    function call5() { cm.rollbackTransaction('progress', conn); }

    expect(cm.openConnection).toBeDefined();
    expect(cm.closeConnection).toBeDefined();
    expect(cm.beginTransaction).toBeDefined();
    expect(cm.commitTransaction).toBeDefined();
    expect(cm.rollbackTransaction).toBeDefined();

    expect(call1).toThrow();
    expect(call2).toThrow();
    expect(call3).toThrow();
    expect(call4).toThrow();
    expect(call5).toThrow();
  });
});
