'use strict';

const Enumeration = require( './system/enumeration.js' );

class ModelType extends Enumeration {

  constructor() {
    super();

    this.EditableRootObject = 'EditableRootObject';
    this.EditableRootCollection = 'EditableRootCollection';
    this.EditableChildObject = 'EditableChildObject';
    this.EditableChildCollection = 'EditableChildCollection';
    this.ReadOnlyRootObject = 'ReadOnlyRootObject';
    this.ReadOnlyRootCollection = 'ReadOnlyRootCollection';
    this.ReadOnlyChildObject = 'ReadOnlyChildObject';
    this.ReadOnlyChildCollection = 'ReadOnlyChildCollection';
    this.CommandObject = 'CommandObject';

    // Immutable object.
    Object.freeze( this );
  }
}

module.exports = new ModelType();
