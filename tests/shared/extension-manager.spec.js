console.log('Testing shared/extension-methods.js...');

var ExtensionManager = require('../../source/shared/extension-manager.js');

describe('Extension manager', function() {
  var em = new ExtensionManager('data_source', '/model/path');
  function fn0 () {}
  function fn1 (a) {}
  function fn2 (a, b) {}
  function fn3 (a, b, c) {}

  it('constructor expects two non-empty string arguments', function() {
    function create01() { return new ExtensionManager(); }
    function create02() { return new ExtensionManager(1987); }
    function create03() { return new ExtensionManager(true); }
    function create04() { return new ExtensionManager(new Date()); }
    function create05() { return new ExtensionManager({}); }
    function create06() { return new ExtensionManager(['data_source', '/model/path']); }
    function create07() { return new ExtensionManager('data_source'); }
    function create08() { return new ExtensionManager('data_source', ''); }
    function create09() { return new ExtensionManager('', '/model/path'); }
    function create10() { return new ExtensionManager('data_source', '/model/path'); }

    expect(create01).toThrow();
    expect(create02).toThrow();
    expect(create03).toThrow();
    expect(create04).toThrow();
    expect(create05).toThrow();
    expect(create06).toThrow();
    expect(create07).toThrow();
    expect(create08).toThrow();
    expect(create09).toThrow();
    expect(create10).not.toThrow();
  });

  it('has the defined properties', function() {

    expect(em.dataSource).toBeDefined();
    expect(em.modelPath).toBeDefined();
    expect(em.daoBuilder).toBeDefined();
    expect(em.toDto).toBeDefined();
    expect(em.fromDto).toBeDefined();
    expect(em.toCto).toBeDefined();
    expect(em.fromCto).toBeDefined();
    expect(em.dataCreate).toBeDefined();
    expect(em.dataFetch).toBeDefined();
    expect(em.dataInsert).toBeDefined();
    expect(em.dataUpdate).toBeDefined();
    expect(em.dataRemove).toBeDefined();
  });

  it('has the defined read-only properties', function() {
    em.dataSource = null;
    em.modelPath = null;

    expect(em.dataSource).toBe('data_source');
    expect(em.modelPath).toBe('/model/path');
  });

  it('daoBuilder property works', function() {
    function set1() { em.daoBuilder = 1987; }
    function set2() { em.daoBuilder = fn0; }
    function set3() { em.daoBuilder = fn1; }
    function set4() { em.daoBuilder = fn2; }
    function set5() { em.daoBuilder = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).not.toThrow();
    expect(set5).toThrow();
  });

  it('toDto property works', function() {
    function set1() { em.toDto = '?'; }
    function set2() { em.toDto = fn0; }
    function set3() { em.toDto = fn1; }

    expect(set1).toThrow();
    expect(set2).not.toThrow();
    expect(set3).toThrow();
  });

  it('fromDto property works', function() {
    function set1() { em.fromDto = true; }
    function set2() { em.fromDto = fn0; }
    function set3() { em.fromDto = fn1; }
    function set4() { em.fromDto = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('toCto property works', function() {
    function set1() { em.toCto = new Date; }
    function set2() { em.toCto = fn0; }
    function set3() { em.toCto = fn1; }

    expect(set1).toThrow();
    expect(set2).not.toThrow();
    expect(set3).toThrow();
  });

  it('fromCto property works', function() {
    function set1() { em.fromCto = {}; }
    function set2() { em.fromCto = fn0; }
    function set3() { em.fromCto = fn1; }
    function set4() { em.fromCto = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('dataCreate property works', function() {
    function set1() { em.dataCreate = 0; }
    function set2() { em.dataCreate = fn0; }
    function set3() { em.dataCreate = fn1; }
    function set4() { em.dataCreate = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('dataFetch property works', function() {
    function set1() { em.dataFetch = null; }
    function set2() { em.dataFetch = fn0; }
    function set3() { em.dataFetch = fn1; }
    function set4() { em.dataFetch = fn2; }
    function set5() { em.dataFetch = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).not.toThrow();
    expect(set5).toThrow();
  });

  it('dataInsert property works', function() {
    function set1() { em.dataInsert = 'data'; }
    function set2() { em.dataInsert = fn0; }
    function set3() { em.dataInsert = fn1; }
    function set4() { em.dataInsert = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('dataUpdate property works', function() {
    function set1() { em.dataUpdate = 3.14; }
    function set2() { em.dataUpdate = fn0; }
    function set3() { em.dataUpdate = fn1; }
    function set4() { em.dataUpdate = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('dataRemove property works', function() {
    function set1() { em.dataRemove = false; }
    function set2() { em.dataRemove = fn0; }
    function set3() { em.dataRemove = fn1; }
    function set4() { em.dataRemove = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });
});
