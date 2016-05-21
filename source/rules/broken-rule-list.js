'use strict';

const Argument = require('../system/argument-check.js');
const PropertyInfo = require('../shared/property-info.js');
const BrokenRule = require('./broken-rule.js');
const BrokenRulesOutput = require('./broken-rules-output.js');
const RuleNotice = require('./rule-notice.js');
const RuleSeverity = require('./rule-severity.js');

const _modelName = new WeakMap();
const _items = new WeakMap();
const _length = new WeakMap();

/**
 * Represents the lists of broken rules.
 *
 * @memberof bo.rules
 */
class BrokenRuleList {

  /**
   * Creates a new broken rule list instance.
   *
   * @param {string} modelName - The name of the model.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
   */
  constructor(modelName) {
    modelName = Argument.inConstructor(this.constructor.name)
      .check(modelName).forMandatory('modelName').asString();

    _modelName.set(this, modelName);
    _items.set(this, {});
    _length.set(this, 0);
  }

  /**
   * Adds a broken rule to the list.
   *
   * @param {bo.rules.BrokenRule} brokenRule - A broken rule to add.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The rule must be a BrokenRule object.
   */
  add(brokenRule) {
    brokenRule = Argument.inMethod(this.constructor.name, 'add')
      .check(brokenRule).forMandatory('brokenRule').asType(BrokenRule);

    const items = _items.get(this);
    let length = _length.get(this);

    if (items[brokenRule.propertyName])
      items[brokenRule.propertyName].push(brokenRule);
    else {
      items[brokenRule.propertyName] = new Array(brokenRule);
      length++;
    }

    _items.set(this, items);
    _length.set(this, length);
  }

  /**
   * Removes the broken rules of a property except of the retained ones.
   * If property is omitted, all broken rules are removed
   * except of the retained ones.
   *
   * @param {bo.rules.PropertyInfo} [property] - A property definition.
   */
  clear(property) {
    const items = _items.get(this);
    let length = _length.get(this);

    //region Clear for property

    /**
     * Removes the broken rules of a property except of the retained ones.
     *
     * @param {string} propertyName - The name of the property that broken rules are deleted of.
     */
    function clearFor (propertyName) {
      if (items[propertyName]) {
        const preserved = items[propertyName].filter(function (item) {
          return item.isPreserved;
        });
        if (preserved.length)
          items[propertyName] = preserved;
        else {
          delete items[propertyName];
          length--;
        }
      }
    }

    //endregion

    if (property instanceof PropertyInfo)
      clearFor(property.name);
    else
      for (const propertyName in items) {
        if (items.hasOwnProperty(propertyName))
          clearFor(propertyName);
      }

    _items.set(this, items);
    _length.set(this, length);
  }

  /**
   * Removes the broken rules of a property, including retained ones.
   * If property is omitted, all broken rules are removed.
   *
   * @param property
   */
  clearAll(property) {
    let items = _items.get(this);
    let length = _length.get(this);

    if (property instanceof PropertyInfo) {
      delete items[property.name];
      length--;
    } else {
      items = {};
      length = 0;
    }

    _items.set(this, items);
    _length.set(this, length);
  }

  /**
   * Determines if the model is valid. The model is valid when it has no
   * broken rule with error severity.
   *
   * @returns {boolean} - True if the model is valid, otherwise false.
   */
  isValid() {
    const items = _items.get(this);
    for (const propertyName in items) {
      if (items.hasOwnProperty(propertyName)) {

        if (items[propertyName].some(function (item) {
            return item.severity === RuleSeverity.error;
          }))
          return false;
      }
    }
    return true;
  }

  /**
   * Transforms the broken rules into a format that can be sent to the client.
   *
   * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
   * @returns {bo.rules.BrokenRulesOutput} The response object to send.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The namespace must be a string.
   */
  output(namespace) {

    namespace = Argument.inMethod(this.constructor.name, 'output')
      .check(namespace).forOptional('namespace').asString();

    const items = _items.get(this);
    const length = _length.get(this);
    const modelName = _modelName.get(this);

    const data = new BrokenRulesOutput();
    if (length) {

      const ns = namespace ? namespace + ':' : '';
      for (const property in items) {
        if (items.hasOwnProperty(property)) {

          items[property].forEach(function(brokenRule) {

            const propertyName = modelName + '.' + brokenRule.propertyName;
            const message = brokenRule.message || ns + propertyName + '.' + brokenRule.ruleName;
            const notice = new RuleNotice(message, brokenRule.severity);

            data.add(propertyName, notice);
          });
        }
      }
    }
    return data;
  }
}

module.exports = BrokenRuleList;
