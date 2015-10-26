'use strict';

//region Imports

var util = require('util');
var config = require('./shared/configuration-reader.js');
var EnsureArgument = require('./system/ensure-argument.js');

var CollectionBase = require('./collection-base.js');
var ModelError = require('./shared/model-error.js');
var ExtensionManagerSync = require('./shared/extension-manager-sync.js');
var EventHandlerList = require('./shared/event-handler-list.js');

var TransferContext = require('./shared/transfer-context.js');

var RuleManager = require('./rules/rule-manager.js');
var BrokenRuleList = require('./rules/broken-rule-list.js');
var AuthorizationAction = require('./rules/authorization-action.js');
var AuthorizationContext = require('./rules/authorization-context.js');
var BrokenRulesResponse = require('./rules/broken-rules-response.js');

var DataPortalAction = require('./shared/data-portal-action.js');
var DataPortalContext = require('./shared/data-portal-context.js');
var DataPortalEvent = require('./shared/data-portal-event.js');
var DataPortalEventArgs = require('./shared/data-portal-event-args.js');
var DataPortalError = require('./shared/data-portal-error.js');

var MODEL_STATE = require('./shared/model-state.js');
var CLASS_NAME = 'EditableRootCollectionSync';
var MODEL_DESC = 'Editable root collection';
var M_FETCH = DataPortalAction.getName(DataPortalAction.fetch);

//endregion

var EditableRootCollectionSyncFactory = function (name, itemType, rules, extensions) {

  name = EnsureArgument.isMandatoryString(name,
      'c_manString', CLASS_NAME, 'name');
  rules = EnsureArgument.isMandatoryType(rules, RuleManager,
      'c_manType', CLASS_NAME, 'rules');
  extensions = EnsureArgument.isMandatoryType(extensions, ExtensionManagerSync,
      'c_manType', CLASS_NAME, 'extensions');

  // Verify the model type of the item type.
  if (itemType.modelType !== 'EditableChildModelSync')
    throw new ModelError('invalidItem',
        itemType.prototype.name, itemType.modelType,
        CLASS_NAME, 'EditableChildModelSync');

  // Get data access object.
  var dao = extensions.getDataAccessObject(name);

  var EditableRootCollectionSync = function (eventHandlers) {
    CollectionBase.call(this);

    eventHandlers = EnsureArgument.isOptionalType(eventHandlers, EventHandlerList,
        'c_optType', name, 'eventHandlers');

    var self = this;
    var state = null;
    var isDirty = false;
    var items = [];
    var brokenRules = new BrokenRuleList(name);
    var isValidated = false;
    var dataContext = null;
    var connection = null;

    /**
     * The name of the model.
     *
     * @name EditableRootCollectionSync#$modelName
     * @type {string}
     * @readonly
     */
    this.$modelName = name;

    /**
     * The count of the child objects in the collection.
     *
     * @name EditableRootCollectionSync#count
     * @type {number}
     * @readonly
     */
    Object.defineProperty(self, 'count', {
      get: function () {
        return items.length;
      },
      enumerable: false
    });

    // Set up event handlers.
    if (eventHandlers)
      eventHandlers.setup(self);

    //region Mark object state

    /*
     * From:         To:  | pri | cre | cha | mfr | rem
     * -------------------------------------------------
     * NULL               |  +  |  +  |  N  |  N  |  N
     * -------------------------------------------------
     * pristine           |  o  |  -  |  +  |  +  |  -
     * -------------------------------------------------
     * created            |  +  |  o  |  o  | (-) |  +
     * -------------------------------------------------
     * changed            |  +  |  -  |  o  |  +  |  -
     * -------------------------------------------------
     * markedForRemoval   |  -  |  -  |  o  |  o  |  +
     * -------------------------------------------------
     * removed            |  -  |  -  |  -  |  -  |  o
     * -------------------------------------------------
     *
     * Explanation:
     *   +  :  possible transition
     *   -  :  not allowed transition, throws exception
     *   o  :  no change, no action
     *   N  :  impossible start up, throws exception
     */

    function markAsPristine() {
      if (state === MODEL_STATE.markedForRemoval || state === MODEL_STATE.removed)
        illegal(MODEL_STATE.pristine);
      else if (state !== MODEL_STATE.pristine) {
        state = MODEL_STATE.pristine;
        isDirty = false;
      }
    }

    function markAsCreated() {
      if (state === null) {
        state = MODEL_STATE.created;
        isDirty = true;
      }
      else if (state !== MODEL_STATE.created)
        illegal(MODEL_STATE.created);
    }

    function markAsChanged(itself) {
      if (state === MODEL_STATE.pristine) {
        state = MODEL_STATE.changed;
        isDirty = isDirty || itself;
        isValidated = false;
      }
      else if (state === MODEL_STATE.created) {
        isDirty = isDirty || itself;
        isValidated = false;
      }
      else if (state === MODEL_STATE.removed)
        illegal(MODEL_STATE.changed);
    }

    function markForRemoval() {
      if (state === MODEL_STATE.pristine || state === MODEL_STATE.changed) {
        state = MODEL_STATE.markedForRemoval;
        isDirty = true;
        propagateRemoval(); // down to children
      }
      else if (state === MODEL_STATE.created)
        state = MODEL_STATE.removed;
      else if (state !== MODEL_STATE.markedForRemoval)
        illegal(MODEL_STATE.markedForRemoval);
    }

    function markAsRemoved() {
      if (state === MODEL_STATE.created || state === MODEL_STATE.markedForRemoval) {
        state = MODEL_STATE.removed;
        isDirty = false;
      }
      else if (state !== MODEL_STATE.removed)
        illegal(MODEL_STATE.removed);
    }

    function illegal(newState) {
      throw new ModelError('transition',
          (state == null ? 'NULL' : MODEL_STATE.getName(state)),
          MODEL_STATE.getName(newState));
    }

    /**
     * Notes that a child object has changed.
     * <br/>_This method is called by child objects._
     *
     * @function EditableRootCollectionSync#childHasChanged
     * @protected
     */
    this.childHasChanged = function() {
      markAsChanged(false);
    };

    function propagateRemoval() {
      items.forEach(function(child) {
        child.remove();
      });
    }

    //endregion

    //region Show object state

    /**
     * Gets the state of the collection. Valid states are:
     * pristine, created, changed, markedForRemoval and removed.
     *
     * @function EditableRootCollectionSync#getModelState
     * @returns {string} The state of the collection.
     */
    this.getModelState = function () {
      return MODEL_STATE.getName(state);
    };

    /**
     * Indicates whether the business object collection has been created newly
     * and not has been yet saved, i.e. its state is created.
     *
     * @function EditableRootCollectionSync#isNew
     * @returns {boolean} True when the business object collection is new, otherwise false.
     */
    this.isNew = function () {
      return state === MODEL_STATE.created;
    };

    /**
     * Indicates whether the business object collection itself or any of its child objects differs the
     * one that is stored in the repository, i.e. its state is created, changed or markedForRemoval.
     *
     * @function EditableRootCollectionSync#isDirty
     * @returns {boolean} True when the business object collection has been changed, otherwise false.
     */
    this.isDirty = function () {
      return state === MODEL_STATE.created ||
          state === MODEL_STATE.changed ||
          state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object collection itself, ignoring its child objects,
     * differs the one that is stored in the repository.
     *
     * @function EditableRootCollectionSync#isSelfDirty
     * @returns {boolean} True when the business object collection itself has been changed, otherwise false.
     */
    this.isSelfDirty = function () {
      return isDirty;
    };

    /**
     * Indicates whether the business object collection will be deleted from the repository,
     * i.e. its state is markedForRemoval.
     *
     * @function EditableRootCollectionSync#isDeleted
     * @returns {boolean} True when the business object collection will be deleted, otherwise false.
     */
    this.isDeleted = function () {
      return state === MODEL_STATE.markedForRemoval;
    };

    /**
     * Indicates whether the business object collection can be saved to the repository,
     * i.e. it has ben changed and is valid, and the user has permission to save it.
     *
     * @function EditableRootCollectionSync#isSavable
     * @returns {boolean} True when the user can save the business object collection, otherwise false.
     */
    this.isSavable = function () {
      var auth;
      if (self.isDeleted)
        auth = canDo(AuthorizationAction.removeObject);
      else if (self.isNew)
        auth = canDo(AuthorizationAction.createObject);
      else
        auth = canDo(AuthorizationAction.updateObject);
      return auth && self.isDirty && self.isValid();
    };

    //endregion

    //region Permissions

    function getAuthorizationContext(action, targetName) {
      return new AuthorizationContext(action, targetName || '', brokenRules);
    }

    function canDo (action) {
      return rules.hasPermission(
          getAuthorizationContext(action)
      );
    }

    function canExecute (methodName) {
      return rules.hasPermission(
          getAuthorizationContext(AuthorizationAction.executeMethod, methodName)
      );
    }

    //endregion

    //region Child methods

    function fetchChildren (dto) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.fetch(dto[property.name]);
      });
    }

    function insertChildren (connection) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.save(connection);
      });
    }

    function updateChildren (connection) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.save(connection);
      });
    }

    function removeChildren (connection) {
      properties.children().forEach(function(property) {
        var child = getPropertyValue(property);
        child.save(connection);
      });
    }

    function childrenAreValid () {
      return properties.children().every(function(property) {
        var child = getPropertyValue(property);
        return child.isValid();
      });
    }

    function checkChildRules () {
      properties.children().forEach(function (property) {
        var child = getPropertyValue(property);
        child.checkRules();
      });
    }

    function getChildBrokenRules (namespace, bro) {
      properties.children().forEach(function (property) {
        var child = getPropertyValue(property);
        var childBrokenRules = child.getBrokenRules(namespace);
        if (childBrokenRules) {
          if (childBrokenRules instanceof Array)
            bro.addChildren(property.name, childBrokenRules);
          else
            bro.addChild(property.name, childBrokenRules);
        }
      });
      return bro;
    }

    //endregion

    //region Actions

    /**
     * Initializes a newly created business object collection.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootCollectionSync#create
     * @protected
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Creating the business object collection has failed.
     */
    this.create = function() {
      data_create();
    };

    /**
     * Initializes a business object collection to be retrieved from the repository.
     * <br/>_This method is called by a factory method with the same name._
     *
     * @function EditableRootCollectionSync#fetch
     * @protected
     * @param {*} [filter] - The filter criteria.
     * @param {string} [method] - An alternative fetch method of the data access object.
     *
     * @throws {@link bo.system.ArgumentError Argument error}:
     *      The method must be a string or null.
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Fetching the business object collection has failed.
     */
    this.fetch = function(filter, method) {

      method = EnsureArgument.isOptionalString(method,
          'm_optString', CLASS_NAME, 'fetch', 'method');

      data_fetch(filter, method || M_FETCH);
    };

    /**
     * Saves the changes of the business object collection to the repository.
     *
     * @function EditableRootCollectionSync#save
     * @returns {EditableRootCollectionSync} The business object collection with the new state after the save.
     *
     * @throws {@link bo.rules.AuthorizationError Authorization error}:
     *      The user has no permission to execute the action.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Inserting the business object collection has failed.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Updating the business object collection has failed.
     * @throws {@link bo.shared.DataPortalError Data portal error}:
     *      Deleting the business object collection has failed.
     */
    this.save = function() {
      if (this.isValid()) {
        /**
         * The event arises before the business object collection will be saved in the repository.
         * The event is followed by a preInsert, preUpdate or preRemove event depending on the
         * state of the business object collection.
         * @event EditableRootCollectionSync#preSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollectionSync} oldObject - The instance of the collection before the data portal action.
         */
        switch (state) {
          case MODEL_STATE.created:
            data_insert();
            return this;
          case MODEL_STATE.changed:
            data_update();
            return this;
          case MODEL_STATE.markedForRemoval:
            data_remove();
            return null;
          default:
            return this;
        }
        /**
         * The event arises after the business object collection has been saved in the repository.
         * The event is preceded by a postInsert, postUpdate or postRemove event depending on the
         * state of the business object collection.
         * @event EditableRootCollectionSync#postSave
         * @param {bo.shared.DataPortalEventArgs} eventArgs - Data portal event arguments.
         * @param {EditableRootCollectionSync} newObject - The instance of the collection after the data portal action.
         */
      }
    };

    /**
     * Marks the business object collection to be deleted from the repository on next save.
     *
     * @function EditableRootCollectionSync#remove
     */
    this.remove = function() {
      markForRemoval();
    };

    //endregion

    //region Validation

    /**
     * Indicates whether all validation rules of all business objects of the
     * collection succeeds. A valid business object collection may have
     * broken rules with severity of success, information and warning.
     *
     * @function EditableRootCollectionSync#isValid
     * @returns {boolean} True when the business object collection is valid, otherwise false.
     */
    this.isValid = function () {
      if (!isValidated)
        this.checkRules();

      return brokenRules.isValid() && childrenAreValid();
    };

    /**
     * Executes all the validation rules of the business object, including the ones
     * of its child objects.
     *
     * @function EditableRootCollectionSync#checkRules
     */
    this.checkRules = function () {
      brokenRules.clear();

      var context = new ValidationContext(store, brokenRules);
      properties.forEach(function(property) {
        rules.validate(property, context);
      });
      checkChildRules();

      isValidated = true;
    };

    /**
     * Gets the broken rules of the business object.
     *
     * @function EditableRootCollectionSync#getBrokenRules
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesOutput} The broken rules of the business object.
     */
    this.getBrokenRules = function (namespace) {
      var bro = brokenRules.output(namespace);
      bro = getChildBrokenRules(namespace, bro);
      return bro.$length ? bro : null;
    };

    /**
     * Gets the response to send to the client in case of broken rules.
     *
     * @function EditableRootCollectionSync#getResponse
     * @param {string} [message] - Human-readable description of the reason of the failure.
     * @param {string} [namespace] - The namespace of the message keys when messages are localizable.
     * @returns {bo.rules.BrokenRulesResponse} The broken rules response to send to the client.
     */
    this.getResponse = function (message, namespace) {
      var output = this.getBrokenRules(namespace);
      return output ? new BrokenRulesResponse(output, message) : null;
    };

    //endregion

    // Immutable object.
    Object.freeze(this);
  };
  util.inherits(EditableRootCollectionSync, CollectionBase);

  /**
   * The name of the model type.
   *
   * @property {string} EditableRootCollectionSync.constructor.modelType
   * @default EditableRootCollectionSync
   * @readonly
   */
  Object.defineProperty(EditableRootCollectionSync, 'modelType', {
    get: function () { return CLASS_NAME; }
  });

  //region Factory methods

  /**
   * Creates a new editable business object collection.
   *
   * @function EditableRootCollectionSync.create
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {EditableRootCollectionSync} A new editable business collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Creating the business object collection has failed.
   */
  EditableRootCollectionSync.create = function(eventHandlers) {
    var instance = new EditableRootCollectionSync(eventHandlers);
    instance.create();
    return instance;
  };

  /**
   * Retrieves an editable business object collection from the repository.
   *
   * @function EditableRootCollectionSync.fetch
   * @param {*} [filter] - The filter criteria.
   * @param {string} [method] - An alternative fetch method of the data access object.
   * @param {bo.shared.EventHandlerList} [eventHandlers] - The event handlers of the instance.
   * @returns {EditableRootCollectionSync} The required editable business object collection.
   *
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The method must be a string or null.
   * @throws {@link bo.system.ArgumentError Argument error}:
   *      The event handlers must be an EventHandlerList object or null.
   * @throws {@link bo.rules.AuthorizationError Authorization error}:
   *      The user has no permission to execute the action.
   * @throws {@link bo.shared.DataPortalError Data portal error}:
   *      Fetching the business object collection has failed.
   */
  EditableRootCollectionSync.fetch = function(filter, method, eventHandlers) {
    var instance = new EditableRootCollectionSync(eventHandlers);
    instance.fetch(filter, method);
    return instance;
  };

  //endregion

  return EditableRootCollectionSync;
};

module.exports = EditableRootCollectionSyncFactory;
