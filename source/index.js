'use strict';

var EditableModel = require('./editable-model.js');
var EditableCollection = require('./editable-collection.js');

var dataTypes = require('./data-types/index.js');
var commonRules = require('./common-rules/index.js');
var daoBuilder = require('./data-access/dao-builder.js');
var shared = require('./shared/index.js');
var rules = require('./rules/index.js');

var businessObjects = {
  EditableModel: EditableModel,
  EditableCollection: EditableCollection,

  dataTypes: dataTypes,
  commonRules: commonRules,
  daoBuilder: daoBuilder,
  shared: shared,
  rules: rules
};

module.exports = businessObjects;
