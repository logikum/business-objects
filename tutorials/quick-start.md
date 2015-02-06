### 1. Imports

Before you create a model definition, first define the namespaces and helper objects:

```
var bo = require('business-objects');

var Properties = bo.shared.PropertyManager;
var Rules = bo.rules.RuleManager;
var Action = bo.rules.AuthorizationAction;
var Extensions = bo.shared.ExtensionManager;
var Property = bo.shared.PropertyInfo;
var F = bo.shared.PropertyFlag;
var dt = bo.dataTypes;
var cr = bo.commonRules;
```

### 2. Model definition

Next define the properties of the model:

```
var orderKey = new Property('orderKey', dt.Integer, F.key | F.readOnly);
var vendorName = new Property('vendorName', dt.Text);
var contractDate = new Property('contractDate', dt.DateTime);
var totalPrice = new Property('totalPrice', dt.Decimal);
var schedules = new Property('schedules', dt.Integer);
var enabled = new Property('enabled', dt.Boolean);
var createdDate = new Property('createdDate', dt.DateTime, F.readOnly);
var modifiedDate = new Property('modifiedDate', dt.DateTime, F.readOnly);

var properties = new Properties(
  'BlanketOrder',
  orderKey,
  vendorName,
  contractDate,
  totalPrice,
  schedules,
  enabled,
  createdDate,
  modifiedDate
);
```

Then define the rules of the model:

```
var rules = new Rules(
  cr.required(vendorName),
  cr.required(contractDate),
  cr.required(totalPrice),
  cr.required(schedules),
  cr.required(enabled),
  cr.isInRole(Action.fetchObject, null, 'developers', 'You are not authorized to retrieve blanket order.'),
  cr.isInRole(Action.createObject, null, 'developers', 'You are not authorized to create blanket order.'),
  cr.isInRole(Action.updateObject, null, 'developers', 'You are not authorized to modify blanket order.'),
  cr.isInRole(Action.removeObject, null, 'developers', 'You are not authorized to delete blanket order.')
);
```

Finally set up the model extensions:

```
var extensions = new Extensions('dao', __filename);
```

Now you can compose the model type and its factory object:

```
var BlanketOrder = bo.EditableRootModel(properties, rules, extensions);

var BlanketOrderFactory = {
  create: function (callback) {
      BlanketOrder.create(callback);
  },
  get: function (key, callback) {
      BlanketOrder.fetch(key, null, callback);
  },
  getByName: function (name, callback) {
      BlanketOrder.fetch(name, 'fetchByName', callback);
  }
};
```

Save the model definition as blanket-order.js.

### 3. Data access object

The model will search a data access object named blanket-order.dao.js,
create it with the required methods:

```
var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderDao = function() {
  BlanketOrderDao.super_.call(this, 'BlanketOrderDao');
};
util.inherits(BlanketOrderDao, DaoBase);

BlanketOrderDao.prototype.create = function(callback) {
  ...
  callback(null, data);
};

BlanketOrderDao.prototype.fetch = function(filter, callback) {
  ...
  callback(null, data);
};

BlanketOrderDao.prototype.fetchByName = function(filter, callback) {
  ...
  callback(null, data);
};

BlanketOrderDao.prototype.insert = function(data, callback) {
  ...
  callback(null, data);
};

BlanketOrderDao.prototype.update = function(data, callback) {
  ...
  callback(null, data);
  }
};

BlanketOrderDao.prototype.remove = function(filter, callback) {
  ...
  callback(null);
};
```

### 4. Model usage

The model can be used now. Create an instance of the model and store it:

```
var BlanketOrder = require('./blanket-order.js');

BlanketOrder.create(function (err, order) {
  if (err) throw err;

  order.vendorName = 'Acme Corp.';
  order.contractDate = contractDate;
  order.totalPrice = 497.5;
  order.schedules = 2;
  order.enabled = true;

  order.save(function (err, order) {
  if (err) throw err;

  // Success.
  var key = order.orderKey;
  });
});
```

Retrieve the created instance of the model, modify it and store it again:

```
var BlanketOrder = require('./blanket-order.js');

BlanketOrder.get(1 /* key */, function (err, order) {
  if (err) throw err;

  order.vendorName = 'Summit Ltd.';
  order.contractDate = contractDate_u;
  order.totalPrice = 672.5;
  order.schedules = 3;
  order.enabled = false;

  order.save(function (err, order) {
    if (err) throw err;

    // Success.
    var timestamp = order.modifiedDate;
  });
});
```

Delete this instance of the model from the repository:

```
var BlanketOrder = require('./blanket-order.js');

BlanketOrder.get(1 /* key */, function (err, order) {
  if (err) throw err;

  order.remove();
  order.save(function (err, order) {
    if (err) throw err;

    // Success: order === null
  });
});
```
