'use strict';

var i18n = require('./i18n.js');

var i18n_bo = new i18n('$bo');

var bo_i18n = function (messagePath) {
  var mp = '';
  if (messagePath && typeof messagePath === 'string') {
    mp = messagePath;
    if (mp.substr(-1) !== '.')
      mp += '.';
  }
  return function () {
    var args = Array.prototype.slice.call(arguments);
    if (args.length > 0) {
      args[0] = mp + args[0];
    }
    return i18n_bo.get.apply(i18n_bo, args);
  }
};

module.exports = bo_i18n;
