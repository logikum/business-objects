console.log( 'Testing system/argument-check.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const Argument = read( 'system/argument-check.js' );
const ArgumentError = read( 'system/argument-error.js' );
const ConstructorError = read( 'system/constructor-error.js' );
const MethodError = read( 'system/method-error.js' );
const PropertyError = read( 'system/property-error.js' );
const Enumeration = read( 'system/enumeration.js' );
const ModelBase = read( 'common/model-base.js' );

const ClearScheduleCommand = require( '../../../data/simple-core/clear-schedule-command.js' );

describe( 'Argument checking function', () => {

  //region Factory

  it( 'returns a builder function', () => {

    const builder = Argument();

    expect( builder ).toEqual( jasmine.any( Function ) );

    const check = builder();

    expect( check.argumentGroup ).toBe( 0 ); // ArgumentGroup.General
    expect( check.argumentName ).toBe( '' );
    expect( check.className ).toBe( '' );
    expect( check.methodName ).toBe( '' );
    expect( check.propertyName ).toBe( '' );

    // Generic
    expect( check.asDefined ).toBeDefined();
    expect( check.hasValue ).toBeDefined();
    // String
    expect( check.asString ).toBeDefined();
    // Number
    expect( check.asNumber ).toBeDefined();
    // Integer
    expect( check.asInteger ).toBeDefined();
    // Boolean
    expect( check.asBoolean ).toBeDefined();
    // Object
    expect( check.asObject ).toBeDefined();
    // Function
    expect( check.asFunction ).toBeDefined();
    // Type
    expect( check.asType ).toBeDefined();
    // Model
    expect( check.asModelType ).toBeDefined();
    // Enumeration
    expect( check.asEnumMember ).toBeDefined();
    // Array
    expect( check.asArray ).toBeDefined();
  } );

  //endregion

  //region Factory functions

  it( 'provides the necessary factory functions', () => {

    const builder1 = Argument();
    const builder2 = Argument.inConstructor( 'CLASS_NAME' );
    const builder3 = Argument.inMethod( 'CLASS_NAME', 'METHOD_NAME' );
    const builder4 = Argument.inProperty( 'CLASS_NAME', 'PROPERTY_NAME' );

    expect( builder1 ).toEqual( jasmine.any( Function ) );
    expect( builder2 ).toEqual( jasmine.any( Function ) );
    expect( builder3 ).toEqual( jasmine.any( Function ) );
    expect( builder4 ).toEqual( jasmine.any( Function ) );

    const check1 = builder1();

    expect( check1.argumentGroup ).toBe( 0 ); // ArgumentGroup.General
    expect( check1.argumentName ).toBe( '' );
    expect( check1.className ).toBe( '' );
    expect( check1.methodName ).toBe( '' );
    expect( check1.propertyName ).toBe( '' );

    const check2 = builder2();

    expect( check2.argumentGroup ).toBe( 1 ); // ArgumentGroup.Constructor
    expect( check2.argumentName ).toBe( '' );
    expect( check2.className ).toBe( 'CLASS_NAME' );
    expect( check2.methodName ).toBe( '' );
    expect( check2.propertyName ).toBe( '' );

    const check3 = builder3();

    expect( check3.argumentGroup ).toBe( 2 ); // ArgumentGroup.Method
    expect( check3.argumentName ).toBe( '' );
    expect( check3.className ).toBe( 'CLASS_NAME' );
    expect( check3.methodName ).toBe( 'METHOD_NAME' );
    expect( check3.propertyName ).toBe( '' );

    const check4 = builder4();

    expect( check4.argumentGroup ).toBe( 3 ); // ArgumentGroup.Property
    expect( check4.argumentName ).toBe( '' );
    expect( check4.className ).toBe( 'CLASS_NAME' );
    expect( check4.methodName ).toBe( '' );
    expect( check4.propertyName ).toBe( 'PROPERTY_NAME' );
  } );

  //endregion

  //region Argument value

  it( 'sets argument value', () => {

    const check = Argument.check( { a: 1, b: 2 } );

    expect( check.value ).toEqual( { a: 1, b: 2 } );
  } );

  //endregion

  //region Argument name and necessity

  it( 'sets argument name and necessity', () => {

    const check1 = Argument.check( true ).for( 'VALUE_1' );
    const check2 = Argument.check( 1234 ).forOptional( 'VALUE_2' );
    const check3 = Argument.check( 'value' ).forMandatory( 'VALUE_3' );

    expect( check1.argumentName ).toBe( 'VALUE_1' );
    expect( check1.isMandatory ).not.toBeDefined();
    expect( check2.argumentName ).toBe( 'VALUE_2' );
    expect( check2.isMandatory ).toBe( false );
    expect( check3.argumentName ).toBe( 'VALUE_3' );
    expect( check3.isMandatory ).toBe( true );
  } );

  //endregion

  //region Exception

  it( 'throws the appropriate exception', () => {

    let ex1, ex2, ex3, ex4;
    try {
      const check1 = Argument.check( 0 ).for( 'text' ).asString();
    } catch (ex) {
      ex1 = ex;
    }
    try {
      const check2 = Argument.inConstructor( 'CLASS_NAME' ).check( 0 ).for( 'text' ).asString();
    } catch (ex) {
      ex2 = ex;
    }
    try {
      const check3 = Argument.inMethod( 'CLASS_NAME', 'METHOD_NAME' ).check( 0 ).for( 'text' ).asString();
    } catch (ex) {
      ex3 = ex;
    }
    try {
      const check4 = Argument.inProperty( 'CLASS_NAME', 'PROPERTY_NAME' ).check( 0 ).for( 'text' ).asString();
    } catch (ex) {
      ex4 = ex;
    }

    expect( ex1 ).toEqual( jasmine.any( ArgumentError ) );
    expect( ex1.name ).toBe( 'ArgumentError' );
    expect( ex1.message ).toBe( 'The text argument must be a string value.' );

    expect( ex2 ).toEqual( jasmine.any( ConstructorError ) );
    expect( ex2.name ).toBe( 'ConstructorError' );
    expect( ex2.message ).toBe( 'The text argument of CLASS_NAME constructor must be a string.' );

    expect( ex3 ).toEqual( jasmine.any( MethodError ) );
    expect( ex3.name ).toBe( 'MethodError' );
    expect( ex3.message ).toBe( 'The text argument of CLASS_NAME.METHOD_NAME method must be a string.' );

    expect( ex4 ).toEqual( jasmine.any( PropertyError ) );
    expect( ex4.name ).toBe( 'PropertyError' );
    expect( ex4.message ).toBe( 'The value of CLASS_NAME.PROPERTY_NAME property must be a string.' );
  } );

  //endregion

  //region Generic

  it( 'asDefined method works', () => {

    function call1() { return Argument.check().asDefined(); }

    const any01 = Argument.check( null ).asDefined();
    const any02 = Argument.check( false ).asDefined();
    const any03 = Argument.check( 1 ).asDefined();
    const any04 = Argument.check( -100.99 ).asDefined();
    const any05 = Argument.check( '' ).asDefined();
    const any06 = Argument.check( 'Romeo and Juliet' ).asDefined();
    const any07 = Argument.check( [] ).asDefined();
    const any08 = Argument.check( {} ).asDefined();
    const any09 = Argument.check( function () {} ).asDefined();
    const any10 = Argument.check( new Date() ).asDefined();
    const any11 = Argument.check( new RegExp( '[0-9]+' ) ).asDefined();

    expect( call1 ).toThrow( 'The  argument must be supplied.' );

    expect( any01 ).toBeDefined();
    expect( any02 ).toBeDefined();
    expect( any03 ).toBeDefined();
    expect( any04 ).toBeDefined();
    expect( any05 ).toBeDefined();
    expect( any06 ).toBeDefined();
    expect( any07 ).toBeDefined();
    expect( any08 ).toBeDefined();
    expect( any09 ).toBeDefined();
    expect( any10 ).toBeDefined();
    expect( any11 ).toBeDefined();
  } );

  it( 'hasValue method works', () => {

    function call1() { return Argument.check().hasValue(); }
    function call2() { return Argument.check( null ).hasValue(); }

    const any01 = Argument.check( false ).hasValue();
    const any02 = Argument.check( 1 ).hasValue();
    const any03 = Argument.check( -100.99 ).hasValue();
    const any04 = Argument.check( '' ).hasValue();
    const any05 = Argument.check( 'Romeo and Juliet' ).hasValue();
    const any06 = Argument.check( [] ).hasValue();
    const any07 = Argument.check( {} ).hasValue();
    const any08 = Argument.check( function () {} ).hasValue();
    const any09 = Argument.check( new Date() ).hasValue();
    const any10 = Argument.check( new RegExp( '[0-9]+' ) ).hasValue();

    expect( call1 ).toThrow( 'The  argument is required.' );
    expect( call2 ).toThrow( 'The  argument is required.' );

    expect( any01 ).toBeDefined();
    expect( any02 ).toBeDefined();
    expect( any03 ).toBeDefined();
    expect( any04 ).toBeDefined();
    expect( any05 ).toBeDefined();
    expect( any06 ).toBeDefined();
    expect( any07 ).toBeDefined();
    expect( any08 ).toBeDefined();
    expect( any09 ).toBeDefined();
    expect( any10 ).toBeDefined();
  } );

  //endregion

  //region String

  it( 'asString method works', () => {

    function call01() { return Argument.check().asString(); }
    function call02() { return Argument.check( null ).asString(); }
    function call03() { return Argument.check( false ).asString(); }
    function call04() { return Argument.check( 1 ).asString(); }
    function call05() { return Argument.check( -100.99 ).asString(); }
    function call06() { return Argument.check( [] ).asString(); }
    function call07() { return Argument.check( {} ).asString(); }
    function call08() { return Argument.check( function () {} ).asString(); }
    function call09() { return Argument.check( new Date() ).asString(); }
    function call10() { return Argument.check( new RegExp( '[0-9]+' ) ).asString(); }

    const any01 = Argument.check( '' ).asString();
    const any02 = Argument.check( 'Romeo and Juliet' ).asString();

    const message = 'The  argument must be a string value.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );

    expect( any01 ).toBe( '' );
    expect( any02 ).toBe( 'Romeo and Juliet' );
  } );

  it( 'asString (optional) method works', () => {

    function call01() { return Argument.check( false ).forOptional().asString(); }
    function call02() { return Argument.check( 1 ).forOptional().asString(); }
    function call03() { return Argument.check( -100.99 ).forOptional().asString(); }
    function call04() { return Argument.check( [] ).forOptional().asString(); }
    function call05() { return Argument.check( {} ).forOptional().asString(); }
    function call06() { return Argument.check( function () {} ).forOptional().asString(); }
    function call07() { return Argument.check( new Date() ).forOptional().asString(); }
    function call08() { return Argument.check( new RegExp( '[0-9]+' ) ).forOptional().asString(); }

    const any01 = Argument.check().forOptional().asString();
    const any02 = Argument.check( null ).forOptional().asString();
    const any03 = Argument.check( '' ).forOptional().asString();
    const any04 = Argument.check( 'Romeo and Juliet' ).forOptional().asString();

    const message = 'The  argument must be a string value or null.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( '' );
    expect( any04 ).toBe( 'Romeo and Juliet' );
  } );

  it( 'asString (mandatory) method works', function () {
    function call01() { return Argument.check().forMandatory().asString(); }

    function call02() { return Argument.check( null ).forMandatory().asString(); }

    function call03() { return Argument.check( false ).forMandatory().asString(); }

    function call04() { return Argument.check( 1 ).forMandatory().asString(); }

    function call05() { return Argument.check( -100.99 ).forMandatory().asString(); }

    function call06() { return Argument.check( [] ).forMandatory().asString(); }

    function call07() { return Argument.check( {} ).forMandatory().asString(); }

    function call08() { return Argument.check( function () {} ).forMandatory().asString(); }

    function call09() { return Argument.check( new Date() ).forMandatory().asString(); }

    function call10() { return Argument.check( new RegExp( '[0-9]+' ) ).forMandatory().asString(); }

    function call11() { return Argument.check( '' ).forMandatory().asString(); }

    const any01 = Argument.check( 'Romeo and Juliet' ).forMandatory().asString();

    const message = 'The  argument must be a non-empty string.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );
    expect( call11 ).toThrow( message );

    expect( any01 ).toBeDefined( 'Romeo and Juliet' );
  } );

  //endregion

  //region Number

  it( 'asNumber (optional) method works', () => {

    function call01() { return Argument.check( false ).forOptional().asNumber(); }
    function call02() { return Argument.check( '' ).forOptional().asNumber(); }
    function call03() { return Argument.check( 'Romeo and Juliet' ).forOptional().asNumber(); }
    function call04() { return Argument.check( [] ).forOptional().asNumber(); }
    function call05() { return Argument.check( {} ).forOptional().asNumber(); }
    function call06() { return Argument.check( function () {} ).forOptional().asNumber(); }
    function call07() { return Argument.check( new Date() ).forOptional().asNumber(); }
    function call08() { return Argument.check( new RegExp( '[0-9]+' ) ).forOptional().asNumber(); }

    const any01 = Argument.check().forOptional().asNumber();
    const any02 = Argument.check( null ).forOptional().asNumber();
    const any03 = Argument.check( 1 ).forOptional().asNumber();
    const any04 = Argument.check( -100.99 ).forOptional().asNumber();

    const message = 'The  argument must be a number value or null.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( 1 );
    expect( any04 ).toBe( -100.99 );
  } );

  it( 'asNumber (mandatory) method works', () => {

    function call01() { return Argument.check().forMandatory().asNumber(); }
    function call02() { return Argument.check( null ).forMandatory().asNumber(); }
    function call03() { return Argument.check( false ).forMandatory().asNumber(); }
    function call04() { return Argument.check( '' ).forMandatory().asNumber(); }
    function call05() { return Argument.check( 'Romeo and Juliet' ).forMandatory().asNumber(); }
    function call06() { return Argument.check( [] ).forMandatory().asNumber(); }
    function call07() { return Argument.check( {} ).forMandatory().asNumber(); }
    function call08() { return Argument.check( function () {} ).forMandatory().asNumber(); }
    function call09() { return Argument.check( new Date() ).forMandatory().asNumber(); }
    function call10() { return Argument.check( new RegExp( '[0-9]+' ) ).forMandatory().asNumber(); }

    const any01 = Argument.check( 1 ).forMandatory().asNumber();
    const any02 = Argument.check( -100.99 ).forMandatory().asNumber();

    const message = 'The  argument must be a number value.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );

    expect( any01 ).toBe( 1 );
    expect( any02 ).toBe( -100.99 );
  } );

  //endregion

  //region Integer

  it( 'asInteger (optional) method works', () => {

    function call01() { return Argument.check( false ).forOptional().asInteger(); }
    function call02() { return Argument.check( -100.99 ).forOptional().asInteger(); }
    function call03() { return Argument.check( '' ).forOptional().asInteger(); }
    function call04() { return Argument.check( 'Romeo and Juliet' ).forOptional().asInteger(); }
    function call05() { return Argument.check( [] ).forOptional().asInteger(); }
    function call06() { return Argument.check( {} ).forOptional().asInteger(); }
    function call07() { return Argument.check( function () {} ).forOptional().asInteger(); }
    function call08() { return Argument.check( new Date() ).forOptional().asInteger(); }
    function call09() { return Argument.check( new RegExp( '[0-9]+' ) ).forOptional().asInteger(); }

    const any01 = Argument.check().forOptional().asInteger();
    const any02 = Argument.check( null ).forOptional().asInteger();
    const any03 = Argument.check( 1 ).forOptional().asInteger();

    const message = 'The  argument must be an integer value or null.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( 1 );
  } );

  it( 'asInteger (mandatory) method works', () => {

    function call01() { return Argument.check().forMandatory().asInteger(); }
    function call02() { return Argument.check( null ).forMandatory().asInteger(); }
    function call03() { return Argument.check( false ).forMandatory().asInteger(); }
    function call04() { return Argument.check( -100.99 ).forMandatory().asInteger(); }
    function call05() { return Argument.check( '' ).forMandatory().asInteger(); }
    function call06() { return Argument.check( 'Romeo and Juliet' ).forMandatory().asInteger(); }
    function call07() { return Argument.check( [] ).forMandatory().asInteger(); }
    function call08() { return Argument.check( {} ).forMandatory().asInteger(); }
    function call09() { return Argument.check( function () {} ).forMandatory().asInteger(); }
    function call10() { return Argument.check( new Date() ).forMandatory().asInteger(); }
    function call11() { return Argument.check( new RegExp( '[0-9]+' ) ).forMandatory().asInteger(); }

    const any01 = Argument.check( 1 ).forMandatory().asInteger();

    const message = 'The  argument must be an integer value.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );
    expect( call11 ).toThrow( message );

    expect( any01 ).toBe( 1 );
  } );

  //endregion

  //region Boolean

  it( 'asBoolean (optional) method works', () => {

    function call01() { return Argument.check( 1 ).forOptional().asBoolean(); }
    function call02() { return Argument.check( -100.99 ).forOptional().asBoolean(); }
    function call03() { return Argument.check( '' ).forOptional().asBoolean(); }
    function call04() { return Argument.check( 'Romeo and Juliet' ).forOptional().asBoolean(); }
    function call05() { return Argument.check( [] ).forOptional().asBoolean(); }
    function call06() { return Argument.check( {} ).forOptional().asBoolean(); }
    function call07() { return Argument.check( function () {} ).forOptional().asBoolean(); }
    function call08() { return Argument.check( new Date() ).forOptional().asBoolean(); }
    function call09() { return Argument.check( new RegExp( '[0-9]+' ) ).forOptional().asBoolean(); }

    const any01 = Argument.check().forOptional().asBoolean();
    const any02 = Argument.check( null ).forOptional().asBoolean();
    const any03 = Argument.check( true ).forOptional().asBoolean();

    const message = 'The  argument must be a Boolean value or null.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( true );
  } );

  it( 'asBoolean (mandatory) method works', () => {

    function call01() { return Argument.check().forMandatory().asBoolean(); }
    function call02() { return Argument.check( null ).forMandatory().asBoolean(); }
    function call03() { return Argument.check( 1 ).forMandatory().asBoolean(); }
    function call04() { return Argument.check( -100.99 ).forMandatory().asBoolean(); }
    function call05() { return Argument.check( '' ).forMandatory().asBoolean(); }
    function call06() { return Argument.check( 'Romeo and Juliet' ).forMandatory().asBoolean(); }
    function call07() { return Argument.check( [] ).forMandatory().asBoolean(); }
    function call08() { return Argument.check( {} ).forMandatory().asBoolean(); }
    function call09() { return Argument.check( function () {} ).forMandatory().asBoolean(); }
    function call10() { return Argument.check( new Date() ).forMandatory().asBoolean(); }
    function call11() { return Argument.check( new RegExp( '[0-9]+' ) ).forMandatory().asBoolean(); }

    const any01 = Argument.check( true ).forMandatory().asBoolean();

    const message = 'The  argument must be a Boolean value.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );
    expect( call11 ).toThrow( message );

    expect( any01 ).toBeDefined( true );
  } );

  //endregion

  //region Object

  const objBase = {};
  const objArray = [];
  const objDate = new Date();
  const objRegExp = new RegExp( '[0-9]+' );

  it( 'asObject (optional) method works', () => {

    function call01() { return Argument.check( false ).forOptional().asObject(); }
    function call02() { return Argument.check( 1 ).forOptional().asObject(); }
    function call03() { return Argument.check( -100.99 ).forOptional().asObject(); }
    function call04() { return Argument.check( '' ).forOptional().asObject(); }
    function call05() { return Argument.check( 'Romeo and Juliet' ).forOptional().asObject(); }
    function call06() { return Argument.check( function () {} ).forOptional().asObject(); }

    const any01 = Argument.check().forOptional().asObject();
    const any02 = Argument.check( null ).forOptional().asObject();
    const any03 = Argument.check( objBase ).forOptional().asObject();
    const any04 = Argument.check( objArray ).forOptional().asObject();
    const any05 = Argument.check( objDate ).forOptional().asObject();
    const any06 = Argument.check( objRegExp ).forOptional().asObject();

    const message = 'The  argument must be an object or null.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( objBase );
    expect( any04 ).toBe( objArray );
    expect( any05 ).toBe( objDate );
    expect( any06 ).toBe( objRegExp );
  } );

  it( 'asObject (mandatory) method works', () => {

    function call01() { return Argument.check().forMandatory().asObject(); }
    function call02() { return Argument.check( null ).forMandatory().asObject(); }
    function call03() { return Argument.check( false ).forMandatory().asObject(); }
    function call04() { return Argument.check( 1 ).forMandatory().asObject(); }
    function call05() { return Argument.check( -100.99 ).forMandatory().asObject(); }
    function call06() { return Argument.check( '' ).forMandatory().asObject(); }
    function call07() { return Argument.check( 'Romeo and Juliet' ).forMandatory().asObject(); }
    function call08() { return Argument.check( function () {} ).forMandatory().asObject(); }

    const any01 = Argument.check( objBase ).forMandatory().asObject();
    const any02 = Argument.check( objArray ).forMandatory().asObject();
    const any03 = Argument.check( objDate ).forMandatory().asObject();
    const any04 = Argument.check( objRegExp ).forMandatory().asObject();

    const message = 'The  argument must be an object.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );

    expect( any01 ).toBe( objBase );
    expect( any02 ).toBe( objArray );
    expect( any03 ).toBe( objDate );
    expect( any04 ).toBe( objRegExp );
  } );

  //endregion

  //region Function

  const fnEmpty = function () {};

  it( 'asFunction (optional) method works', () => {

    function call01() { return Argument.check( false ).forOptional().asFunction(); }
    function call02() { return Argument.check( 1 ).forOptional().asFunction(); }
    function call03() { return Argument.check( -100.99 ).forOptional().asFunction(); }
    function call04() { return Argument.check( '' ).forOptional().asFunction(); }
    function call05() { return Argument.check( 'Romeo and Juliet' ).forOptional().asFunction(); }
    function call06() { return Argument.check( [] ).forOptional().asFunction(); }
    function call07() { return Argument.check( {} ).forOptional().asFunction(); }
    function call08() { return Argument.check( new Date() ).forOptional().asFunction(); }
    function call09() { return Argument.check( new RegExp( '[0-9]+' ) ).forOptional().asFunction(); }

    const any01 = Argument.check().forOptional().asFunction();
    const any02 = Argument.check( null ).forOptional().asFunction();
    const any03 = Argument.check( fnEmpty ).forOptional().asFunction();

    const message = 'The  argument must be a function or null.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( fnEmpty );
  } );

  it( 'isMandatoryFunction method works', () => {

    function call01() { return Argument.check( false ).forMandatory().asFunction(); }
    function call02() { return Argument.check().forMandatory().asFunction(); }
    function call03() { return Argument.check( null ).forMandatory().asFunction(); }
    function call04() { return Argument.check( 1 ).forMandatory().asFunction(); }
    function call05() { return Argument.check( -100.99 ).forMandatory().asFunction(); }
    function call06() { return Argument.check( '' ).forMandatory().asFunction(); }
    function call07() { return Argument.check( 'Romeo and Juliet' ).forMandatory().asFunction(); }
    function call08() { return Argument.check( [] ).forMandatory().asFunction(); }
    function call09() { return Argument.check( {} ).forMandatory().asFunction(); }
    function call10() { return Argument.check( new Date() ).forMandatory().asFunction(); }
    function call11() { return Argument.check( new RegExp( '[0-9]+' ) ).forMandatory().asFunction(); }

    const any01 = Argument.check( fnEmpty ).forMandatory().asFunction();

    const message = 'The  argument must be a function.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );
    expect( call11 ).toThrow( message );

    expect( any01 ).toBe( fnEmpty );
  } );

  //endregion

  //region Type

  it( 'asType (optional) method works', () => {

    function call01() { return Argument.check( false ).forOptional().asType( Boolean ); }
    function call02() { return Argument.check( 1 ).forOptional().asType( Number ); }
    function call03() { return Argument.check( -100.99 ).forOptional().asType( Number ); }
    function call04() { return Argument.check( '' ).forOptional().asType( String ); }
    function call05() { return Argument.check( 'Romeo and Juliet' ).forOptional().asType( String ); }

    const any01 = Argument.check( undefined ).forOptional().asType( Object );
    const any02 = Argument.check( null ).forOptional().asType( Object );
    const any03 = Argument.check( objArray ).forOptional().asType( Array );
    const any04 = Argument.check( objBase ).forOptional().asType( Object );
    const any05 = Argument.check( objDate ).forOptional().asType( Date );
    const any06 = Argument.check( objRegExp ).forOptional().asType( RegExp );
    const any07 = Argument.check( fnEmpty ).forOptional().asType( Function );
    const any08 = Argument.check( { x: 0 } ).forOptional().asType( [ Function, Object ] );

    expect( call01 ).toThrow( 'The  argument must be a Boolean object or null.' );
    expect( call02 ).toThrow( 'The  argument must be a Number object or null.' );
    expect( call03 ).toThrow( 'The  argument must be a Number object or null.' );
    expect( call04 ).toThrow( 'The  argument must be a String object or null.' );
    expect( call05 ).toThrow( 'The  argument must be a String object or null.' );

    expect( any01 ).toBe( null );
    expect( any02 ).toBe( null );
    expect( any03 ).toBe( objArray );
    expect( any04 ).toBe( objBase );
    expect( any05 ).toBe( objDate );
    expect( any06 ).toBe( objRegExp );
    expect( any07 ).toBe( fnEmpty );
    expect( any08.x ).toBe( 0 );
  } );

  it( 'asType (mandatory) method works', () => {

    function call01() { return Argument.check( undefined ).forMandatory().asType( Object ); }
    function call02() { return Argument.check( null ).forMandatory().asType( Object ); }
    function call03() { return Argument.check( false ).forMandatory().asType( Boolean ); }
    function call04() { return Argument.check( 1 ).forMandatory().asType( Number ); }
    function call05() { return Argument.check( -100.99 ).forMandatory().asType( Number ); }
    function call06() { return Argument.check( '' ).forMandatory().asType( String ); }
    function call07() { return Argument.check( 'Romeo and Juliet' ).forMandatory().asType( String ); }

    const any01 = Argument.check( objArray ).forMandatory().asType( Array );
    const any02 = Argument.check( objBase ).forMandatory().asType( Object );
    const any03 = Argument.check( objDate ).forMandatory().asType( Date );
    const any04 = Argument.check( objRegExp ).forMandatory().asType( RegExp );
    const any05 = Argument.check( fnEmpty ).forMandatory().asType( Function );
    const any06 = Argument.check( { x: 0 } ).forMandatory().asType( [ Function, Object ] );

    expect( call01 ).toThrow( 'The  argument must be a Object object.' );
    expect( call02 ).toThrow( 'The  argument must be a Object object.' );
    expect( call03 ).toThrow( 'The  argument must be a Boolean object.' );
    expect( call04 ).toThrow( 'The  argument must be a Number object.' );
    expect( call05 ).toThrow( 'The  argument must be a Number object.' );
    expect( call06 ).toThrow( 'The  argument must be a String object.' );
    expect( call07 ).toThrow( 'The  argument must be a String object.' );

    expect( any01 ).toBe( objArray );
    expect( any02 ).toBe( objBase );
    expect( any03 ).toBe( objDate );
    expect( any04 ).toBe( objRegExp );
    expect( any05 ).toBe( fnEmpty );
    expect( any06.x ).toBe( 0 );
  } );

  //endregion

  //region Model

  it( 'asModelType method works', () => {

    const cmd = ClearScheduleCommand.create();

    function call01() { return Argument.check( undefined ).for().asModelType( 'CommandObject' ); }
    function call02() { return Argument.check( null ).for().asModelType( 'CommandObject' ); }
    function call03() { return Argument.check( {} ).for().asModelType( 'CommandObject' ); }
    function call04() { return Argument.check( cmd ).for().asModelType( 'EditableRootObject' ); }
    function call05() { return Argument.check( cmd ).for().asModelType( 'ReadOnlyChildObject', 'Invalid model type!' ); }

    const cmd01 = Argument.check( cmd ).for().asModelType( 'CommandObject' );

    expect( call01 ).toThrow( 'The  argument must be CommandObject type.' );
    expect( call02 ).toThrow( 'The  argument must be CommandObject type.' );
    expect( call03 ).toThrow( 'The  argument must be CommandObject type.' );
    expect( call04 ).toThrow( 'The  argument must be EditableRootObject type.' );
    expect( call05 ).toThrow( 'Invalid model type!' );

    expect( cmd01 ).toBe( cmd );
  } );

  //endregion

  //region Enumeration

  it( 'asEnumMember method works', () => {

    class Numbers1 extends Enumeration {
      constructor() {
        super();
        this.one = 0;
        this.two = 1;
        this.three = 2;
        Object.freeze( this );
      }
    }
    const Numbers = new Numbers1();

    function call01() { return Argument.check( undefined ).for().asEnumMember( Numbers ); }
    function call02() { return Argument.check( null ).for().asEnumMember( Numbers ); }
    function call03() { return Argument.check( false ).for().asEnumMember( Numbers ); }
    function call04() { return Argument.check( -100.99 ).for().asEnumMember( Numbers ); }
    function call05() { return Argument.check( '' ).for().asEnumMember( Numbers ); }
    function call06() { return Argument.check( 'Romeo and Juliet' ).for().asEnumMember( Numbers ); }
    function call07() { return Argument.check( [] ).for().asEnumMember( Numbers ); }
    function call08() { return Argument.check( {} ).for().asEnumMember( Numbers ); }
    function call09() { return Argument.check( function () {} ).for().asEnumMember( Numbers ); }
    function call10() { return Argument.check( new Date() ).for().asEnumMember( Numbers ); }
    function call11() { return Argument.check( new RegExp( '[0-9]+' ) ).for().asEnumMember( Numbers ); }

    const enum1 = Argument.check( 1 ).for().asEnumMember( Numbers );

    const message = 'The  argument must be a Numbers1 item.';
    expect( call01 ).toThrow();
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );
    expect( call11 ).toThrow( message );

    expect( enum1 ).toEqual( Numbers.two );
  } );

  //endregion

  //region Array

  it( 'asArray (optional) method works', () => {

    function call1() { return Argument.check( false ).forOptional().asArray( String ); }
    function call2() { return Argument.check( 1 ).forOptional().asArray( String ); }
    function call3() { return Argument.check( -100.99 ).forOptional().asArray( String ); }
    function call4() { return Argument.check( {} ).forOptional().asArray( String ); }
    function call5() { return Argument.check( function () {} ).forOptional().asArray( String ); }
    function call6() { return Argument.check( new Date() ).forOptional().asArray( String ); }
    function call7() { return Argument.check( new RegExp( '[0-9]+' ) ).forOptional().asArray( String ); }
    function call8() { return Argument.check( [ 'first', 13 ] ).forOptional().asArray( String ); }

    const any01 = Argument.check( undefined ).forOptional().asArray( String );
    const any02 = Argument.check( null ).forOptional().asArray( String );
    const any03 = Argument.check( '' ).forOptional().asArray( String );
    const any04 = Argument.check( 'Romeo and Juliet' ).forOptional().asArray( String );
    const any05 = Argument.check( [ 'one' ] ).forOptional().asArray( String );
    const any06 = Argument.check( [ 'one', 'two', 'three' ] ).forOptional().asArray( String );
    const any07 = Argument.check( new ModelBase() ).forOptional().asArray( ModelBase );
    const any08 = Argument.check( [ new ModelBase(), new ModelBase() ] ).forOptional().asArray( ModelBase );

    const message = 'The  argument must be an array of String values, or a single String value or null.';
    expect( call1 ).toThrow( message );
    expect( call2 ).toThrow( message );
    expect( call3 ).toThrow( message );
    expect( call4 ).toThrow( message );
    expect( call5 ).toThrow( message );
    expect( call6 ).toThrow( message );
    expect( call7 ).toThrow( message );
    expect( call8 ).toThrow( message );

    expect( any01 ).toBeDefined();
    expect( any02 ).toBeDefined();
    expect( any03 ).toBeDefined();
    expect( any04 ).toBeDefined();
    expect( any05 ).toBeDefined();
    expect( any06 ).toBeDefined();
    expect( any07 ).toBeDefined();
    expect( any08 ).toBeDefined();
  } );

  it( 'asArray (mandatory) method works', () => {

    function call01() { return Argument.check( undefined ).forMandatory().asArray( String ); }
    function call02() { return Argument.check( null ).forMandatory().asArray( String ); }
    function call03() { return Argument.check( false ).forMandatory().asArray( String ); }
    function call04() { return Argument.check( 1 ).forMandatory().asArray( String ); }
    function call05() { return Argument.check( -100.99 ).forMandatory().asArray( String ); }
    function call06() { return Argument.check( {} ).forMandatory().asArray( String ); }
    function call07() { return Argument.check( function () {} ).forMandatory().asArray( String ); }
    function call08() { return Argument.check( new Date() ).forMandatory().asArray( String ); }
    function call09() { return Argument.check( new RegExp( '[0-9]+' ) ).forMandatory().asArray( String ); }
    function call10() { return Argument.check( [ 'first', 13 ] ).forMandatory().asArray( String ); }

    const any01 = Argument.check( '' ).forMandatory().asArray( String );
    const any02 = Argument.check( 'Romeo and Juliet' ).forMandatory().asArray( String );
    const any03 = Argument.check( [ 'one' ] ).forMandatory().asArray( String );
    const any04 = Argument.check( [ 'one', 'two', 'three' ] ).forMandatory().asArray( String );
    const any05 = Argument.check( new ModelBase() ).forMandatory().asArray( ModelBase );
    const any06 = Argument.check( [ new ModelBase(), new ModelBase() ] ).forMandatory().asArray( ModelBase );

    const message = 'The  argument must be an array of String values or a single String value.';
    expect( call01 ).toThrow( message );
    expect( call02 ).toThrow( message );
    expect( call03 ).toThrow( message );
    expect( call04 ).toThrow( message );
    expect( call05 ).toThrow( message );
    expect( call06 ).toThrow( message );
    expect( call07 ).toThrow( message );
    expect( call08 ).toThrow( message );
    expect( call09 ).toThrow( message );
    expect( call10 ).toThrow( message );

    expect( any01 ).toBeDefined();
    expect( any02 ).toBeDefined();
    expect( any03 ).toBeDefined();
    expect( any04 ).toBeDefined();
    expect( any05 ).toBeDefined();
    expect( any06 ).toBeDefined();
  } );

  //endregion
} );
