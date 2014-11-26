function objectExtensions() {

  Object.defineProperty(Object.prototype, 'extend', {
    value: function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var object = Object.create(this);
      var length = arguments.length;
      var index = length;

      while (index) {
        var extension = arguments[length - (index--)];

        for (var property in extension)
          if (property !== 'clones' && hasOwnProperty.call(extension, property) ||
              typeof object[property] === 'undefined')
            object[property] = extension[property];

        if (hasOwnProperty.call(extension, 'clones'))
          extension.clones.unshift(object);
        else
          extension.clones = [object];
      }
      return object;
    }
  });

  Object.defineProperty(Object.prototype, 'instanceof', {
    value: function (prototype) {
      if (Object.prototype.hasOwnProperty.call(prototype, 'clones'))
        var clones = prototype.clones;
      var object = this;

      do {
        if (object === prototype || clones && clones.indexOf(object) >= 0)
          return true;

        object = Object.getPrototypeOf(object);
      } while (object);

      return false;
    }
  });

  Object.defineProperty(Object.prototype, 'define', {
    value: function (property, value) {
      this[property] = value;

      if (Object.prototype.hasOwnProperty.call(this, 'clones')) {
        var clones = this.clones;
        var length = clones.length;

        while (length) {
          var clone = clones[--length];
          if (typeof clone[property] === 'undefined')
            clone.define(property, value);
        }
      }
    }
  });
}

module.exports = objectExtensions;
