'use strict';

var i18n = require('./i18n.js');

var getLocalizer = function (keyRoot) {
  var boLocales = new i18n('$bo', keyRoot);

  return function () {
    return boLocales.get.apply(boLocales, arguments.length ? arguments : ['default']);
  }
};

module.exports = getLocalizer;
