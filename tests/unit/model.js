
class ModelType {
  constructor( brand, name ) {
    this.brand = brand;
    this.name = name;
    Object.freeze( this );
  }
}

class Factory {
  constructor( brand ) {
    const modelType = ModelType.bind( undefined, brand );
    Object.freeze( modelType );
    return modelType;
  }
}
Object.freeze( Factory );

module.exports = Factory;
