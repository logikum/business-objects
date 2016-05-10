console.log( 'Testing system/index.js...' );

const system = require( '../../../source/system/index.js' );

const ArgumentError = require( '../../../source/system/argument-error.js' );
const ComposerError = require( '../../../source/system/composer-error.js' );
const ConstructorError = require( '../../../source/system/constructor-error.js' );
const MethodError = require( '../../../source/system/method-error.js' );
const PropertyError = require( '../../../source/system/property-error.js' );
const EnumerationError = require( '../../../source/system/enumeration-error.js' );
const NotImplementedError = require( '../../../source/system/not-implemented-error.js' );

const Enumeration = require( '../../../source/system/enumeration.js' );
const Argument = require( '../../../source/system/argument-check.js' );
const UserInfo = require( '../../../source/system/user-info.js' );
//const Utility = require('../../../source/system/utility.js');

describe( 'System component index', function () {

  it( 'properties return correct components', function () {

    expect( new system.ArgumentError( 'message' ) ).toEqual( jasmine.any( ArgumentError ) );
    expect( new system.ComposerError( 'message' ) ).toEqual( jasmine.any( ComposerError ) );
    expect( new system.ConstructorError( 'message' ) ).toEqual( jasmine.any( ConstructorError ) );
    expect( new system.MethodError( 'message' ) ).toEqual( jasmine.any( MethodError ) );
    expect( new system.PropertyError( 'message' ) ).toEqual( jasmine.any( PropertyError ) );
    expect( new system.EnumerationError( 'message' ) ).toEqual( jasmine.any( EnumerationError ) );
    expect( new system.NotImplementedError( 'message' ) ).toEqual( jasmine.any( NotImplementedError ) );

    expect( new system.Enumeration( 'item' ) ).toEqual( jasmine.any( Enumeration ) );
    expect( system.Argument ).toEqual( Argument );
    expect( new system.UserInfo( 'anonymous' ) ).toEqual( jasmine.any( UserInfo ) );
    expect( system.Utility ).toEqual( jasmine.any( Function ) );
  } );
} );
