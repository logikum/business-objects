function blueprint(f) {

  var g = function () {
    f.apply(this, arguments);
    g.clones.unshift(this);

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    for (var property in g)
      if (property !== 'clones' && hasOwnProperty.call(g, property))
        this[property] = g[property];
  };

  g.clones = [];

  return g;
}

module.exports = blueprint;
