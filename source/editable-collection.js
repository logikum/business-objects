'use strict';

var util = require('util');
var ModelBase = require('./model-base.js');
//var EditableModel = require('./editable-model.js');

module.exports = function(name, itemType) {

  if (typeof name !== 'string')
    throw new Error('The name argument of EditableCollection constructor must be a string.');
  if (name.trim().length === 0)
    throw new Error('The name argument of EditableCollection constructor is required.');

  if (typeof itemType !== 'function')
    throw new Error('Argument itemType of EditableCollection constructor must be an EditableModel type.');

  var EditableCollection = function (parent) {

    var self = this;
    var items = new Array();

    //region Model properties and methods

    this.name = name;

    this.create = function () {
      var item = new itemType(parent, null);
      items.push(item);
      return item;
    };

    this.load = function (data) {
      if (data instanceof Array) {
        data.forEach(function (dto) {
          var item = new itemType(parent, dto);
          items.push(item);
        });
      }
    };

    this.remove = function () {
      items.forEach(function (item) {
        item.remove();
      });
    };

    this.save = function () {
      items.forEach(function (item) {
        item.save();
      });
    };

    this.toCto = function () {
      var cto = [];
      items.forEach(function (item) {
        cto.push(item.toCto());
      });
      return cto;
    };

    this.fromCto = function (data) {
      if (data instanceof Array) {
        data.forEach(function (cto) {
          var item = new itemType(parent);
          item.fromCto(cto);
          items.push(item);
        });
      }
    };

    //endregion

    //region Public array properties and methods

    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    this.forEach = function (callback) {
      items.forEach(callback);
    };

    this.every = function (callback) {
      return items.every(callback);
    };

    this.some = function (callback) {
      return items.some(callback);
    };

    this.filter = function (callback) {
      return items.filter(callback);
    };

    this.map = function (callback) {
      return items.map(callback);
    };

    this.sort = function (fnCompare) {
      return items.sort(fnCompare);
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableCollection, ModelBase);

  return EditableCollection;
};
