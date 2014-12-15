'use strict';

var BlanketOrderDao = function() {

  var repository = null;

  this.create = function() {
    console.log('--- Blanket order DAO.create');
    return {};
  };

  this.fetch = function(filter) {
    console.log('--- Blanket order DAO.fetch');
    return repository;
  };

  this.fetchByName = function(filter) {
    console.log('--- Blanket order DAO.fetchByName');
    return repository;
  };

  this.insert = function(data) {
    console.log('--- Blanket order DAO.insert');
    data.orderKey = 1;
    repository = data;
    return data;
  };

  this.update = function(data) {
    console.log('--- Blanket order DAO.update');
    repository = data;
    return data;
  };

  this.remove = function(filter) {
    console.log('--- Blanket order DAO.remove');
    repository = null;
  };

};

module.exports = BlanketOrderDao;
