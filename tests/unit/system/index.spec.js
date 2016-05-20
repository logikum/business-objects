console.log( 'Testing system/index.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const system = read( 'system/index.js' );

const ArgumentError = read( 'system/argument-error.js' );
const ComposerError = read( 'system/composer-error.js' );
const ConfigurationError = read( 'system/configuration-error.js');
// const ConfigurationReader = read( 'system/configuration-reader.js');
const ConstructorError = read( 'system/constructor-error.js' );
const MethodError = read( 'system/method-error.js' );
const PropertyError = read( 'system/property-error.js' );
const EnumerationError = read( 'system/enumeration-error.js' );
const NotImplementedError = read( 'system/not-implemented-error.js' );

const Enumeration = read( 'system/enumeration.js' );
const Argument = read( 'system/argument-check.js' );
const UserInfo = read( 'system/user-info.js' );
//const Utility = read( 'system/utility.js');

describe( 'System component index', () => {

  it( 'properties return correct components', () => {

    expect( new system.ArgumentError( 'message' ) ).toEqual( jasmine.any( ArgumentError ) );
    expect( new system.ComposerError( 'message' ) ).toEqual( jasmine.any( ComposerError ) );
    expect( new system.ConfigurationError( 'message' ) ).toEqual( jasmine.any( ConfigurationError ) );
    expect( system.ConfigurationReader ).toEqual( jasmine.any( Function ) );
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
