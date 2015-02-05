/**
 * External is a virtual namespace to describe callbacks to implement
 * in external objects that use business objects.
 *
 * @namespace external
 */
var external = {
  /**
   * The callback to be called when the execution of a connection manager method has finished.
   *
   * @callback external~cbConnectionManager
   * @param {error} err - The error that occurred in the connection manager.
   * @param {object} connection - The connection for the data source.
   */
  cbConnectionManager: function (err, connection) {},

  /**
   * The callback to be called when the execution of a method has finished
   * that calls an asynchronous data portal action.
   *
   * @callback external~cbDataPortal
   * @param {(bo.shared.DataPortalError|bo.rules.AuthorizationError)} err - The error that occurred in the data portal action.
   * @param {object} result - The business object instance with the new state.
   */
  cbDataPortal: function (err, result) {},

  /**
   * The callback to be called in collection methods.
   *
   * @param {{}} currentValue - The current item being processed in the collection.
   * @param {number} index - The index of the current item being processed in the collection.
   * @param {Array.<{}>} collection - The collection method was called upon.
   */
  cbCollectionItem: function (currentValue, index, collection) {},

  /**
   * The callback to be called to define the sort order in a collection.
   *
   * @param {{}} a - First object to compare.
   * @param {{}} b - Second object to compare.
   * @returns {number} Returns
   *
   *    * < 0, when a comes first
   *    * = 0, when a and b are left unchanged
   *    * > 0, when b comes first
   */
  cbCompare: function (a, b) {}
};

/**
 * Internal is a virtual namespace to describe generic functions passed as parameters
 * and called internally in business objects and their components.
 *
 * @namespace internal
 */
var internal = {
  /**
   * Gets the value of a model property.
   *
   * @function internal~getValue
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @returns {*} The current value of the property.
   */
  getValue: function (property) {},

  /**
   * Sets the value of a model property.
   *
   * @function internal~setValue
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @param {*} value - The new value of the property.
   */
  setValue: function (property, value) {}
};
