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
  setValue: function (property, value) {},

  /**
   * Initializes the business objects.
   *
   * @function internal~initializeCfg
   * @param {string} cfgPath -
   *    The relative path of the {@link external.configurationFile configuration file} (.js or .json).
   *    E.g. /config/business-objects.json
   */
  initializeCfg: function (cfgPath) {}
};
