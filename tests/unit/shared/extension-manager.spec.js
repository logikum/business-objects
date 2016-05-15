console.log('Testing shared/extension-methods.js...');

function read ( filename ) {
  return require( '../../../source/' + filename );
}
var path = require('path');
var ExtensionManager = read( 'shared/extension-manager.js');
var DaoBase = read( 'data-access/dao-base.js');
var DataPortalContext = read( 'shared/data-portal-context.js');

var DaoBuilder = require('../../../data/custom-core/dao-builder.js');

describe('Extension manager', () => {
  var em = new ExtensionManager('data_source', '/model/path');
  function fn0 () {}
  function fn1 (a) {}
  function fn2 (a, b) {}
  function fn3 (a, b, c) {}
  function fn4 (a, b, c, d) {}
  function fn5 (a, b, c, d, e) {}

  it('constructor expects two non-empty string arguments', () => {
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

  it('has the defined properties', () => {

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
    expect(em.dataExecute).toBeDefined();
  });

  it('has the defined read-only properties', () => {
    em.dataSource = null;
    em.modelPath = null;

    expect(em.dataSource).toBe('data_source');
    expect(em.modelPath).toBe('/model/path');
  });

  it('daoBuilder property works', () => {
    function set1() { em.daoBuilder = 1987; }
    function set2() { em.daoBuilder = fn0; }
    function set3() { em.daoBuilder = fn1; }
    function set4() { em.daoBuilder = fn2; }
    function set5() { em.daoBuilder = fn3; }
    function set6() { em.daoBuilder = fn4; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).toThrow();
    expect(set5).not.toThrow();
    expect(set6).toThrow();
  });

  it('toDto property works', () => {
    function set1() { em.toDto = '?'; }
    function set2() { em.toDto = fn0; }
    function set3() { em.toDto = fn1; }
    function set4() { em.toDto = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('fromDto property works', () => {
    function set1() { em.fromDto = true; }
    function set2() { em.fromDto = fn0; }
    function set3() { em.fromDto = fn1; }
    function set4() { em.fromDto = fn2; }
    function set5() { em.fromDto = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).not.toThrow();
    expect(set5).toThrow();
  });

  it('toCto property works', () => {
    function set1() { em.toCto = new Date; }
    function set2() { em.toCto = fn0; }
    function set3() { em.toCto = fn1; }
    function set4() { em.toCto = fn2; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
  });

  it('fromCto property works', () => {
    function set1() { em.fromCto = {}; }
    function set2() { em.fromCto = fn0; }
    function set3() { em.fromCto = fn1; }
    function set4() { em.fromCto = fn2; }
    function set5() { em.fromCto = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).not.toThrow();
    expect(set5).toThrow();
  });

  it('dataCreate property works', () => {
    function set1() { em.dataCreate = 0; }
    function set2() { em.dataCreate = fn0; }
    function set3() { em.dataCreate = fn1; }
    function set4() { em.dataCreate = fn2; }
    function set5() { em.dataCreate = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
    expect(set5).toThrow();
  });

  it('dataFetch property works', () => {
    function set1() { em.dataFetch = null; }
    function set2() { em.dataFetch = fn0; }
    function set3() { em.dataFetch = fn1; }
    function set4() { em.dataFetch = fn2; }
    function set5() { em.dataFetch = fn3; }
    function set6() { em.dataFetch = fn4; }
    function set7() { em.dataFetch = fn5; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).toThrow();
    expect(set5).not.toThrow();
    expect(set6).toThrow();
    expect(set7).toThrow();
  });

  it('dataInsert property works', () => {
    function set1() { em.dataInsert = 'data'; }
    function set2() { em.dataInsert = fn0; }
    function set3() { em.dataInsert = fn1; }
    function set4() { em.dataInsert = fn2; }
    function set5() { em.dataInsert = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
    expect(set5).toThrow();
  });

  it('dataUpdate property works', () => {
    function set1() { em.dataUpdate = 3.14; }
    function set2() { em.dataUpdate = fn0; }
    function set3() { em.dataUpdate = fn1; }
    function set4() { em.dataUpdate = fn2; }
    function set5() { em.dataUpdate = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
    expect(set5).toThrow();
  });

  it('dataRemove property works', () => {
    function set1() { em.dataRemove = false; }
    function set2() { em.dataRemove = fn0; }
    function set3() { em.dataRemove = fn1; }
    function set4() { em.dataRemove = fn2; }
    function set5() { em.dataRemove = fn3; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).not.toThrow();
    expect(set4).toThrow();
    expect(set5).toThrow();
  });

  it('dataExecute property works', () => {
    function set1() { em.dataExecute = null; }
    function set2() { em.dataExecute = fn0; }
    function set3() { em.dataExecute = fn1; }
    function set4() { em.dataExecute = fn2; }
    function set5() { em.dataExecute = fn3; }
    function set6() { em.dataExecute = fn4; }

    expect(set1).toThrow();
    expect(set2).toThrow();
    expect(set3).toThrow();
    expect(set4).not.toThrow();
    expect(set5).toThrow();
    expect(set6).toThrow();
  });

  it('getDataAccessObject method works', () => {

    var name1 = 'ClearScheduleCommand';
    var path1 = '../../../data/simple-core/clear-schedule-command.js';
    var filename1 = path.join(__dirname, path1);
    var em1 = new ExtensionManager('dao', filename1);
    var dao1 = em1.getDataAccessObject(name1);

    expect(dao1).toEqual(jasmine.any(DaoBase));
    expect(dao1.name).toEqual(name1 + 'Dao');

    var name2 = 'RescheduleShippingCommand';
    var path2 = '../../../data/custom-core/models/reschedule-shipping-command.js';
    var filename2 = path.join(__dirname, path2);
    var em2 = new ExtensionManager('dal', filename2);
    em2.daoBuilder = DaoBuilder;
    var dao2 = em2.getDataAccessObject(name2);

    expect(dao2).toEqual(jasmine.any(DaoBase));
    expect(dao2.name).toEqual(name2 + 'Dao');
  });

  it('$runMethod method works', () => {

    expect(em.$runMethod).toBeDefined();
    expect(em.$runMethod).toEqual(jasmine.any(Function));
    expect(em.$runMethod('method', {}, new DataPortalContext(), null)).toEqual(undefined);
  });
});
