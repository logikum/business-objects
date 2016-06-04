console.log( 'Testing common-rules/index.js...' );

function read ( filename ) {
  return require( '../../../source/' + filename );
}
const cr = read( 'common-rules/index.js' );

const PropertyInfo = read( 'common/property-info.js' );
const Text = read( 'data-types/text.js' );
const AuthorizationAction = read( 'rules/authorization-action.js' );

const IsInRoleRule = read( 'common-rules/is-in-role-rule.js' );
const IsInAnyRoleRule = read( 'common-rules/is-in-any-role-rule.js' );
const IsInAllRolesRule = read( 'common-rules/is-in-all-roles-rule.js' );
const IsNotInRoleRule = read( 'common-rules/is-not-in-role-rule.js' );
const IsNotInAnyRoleRule = read( 'common-rules/is-not-in-any-role-rule.js' );

const RequiredRule = read( 'common-rules/required-rule.js' );
const MaxLengthRule = read( 'common-rules/max-length-rule.js' );
const MinLengthRule = read( 'common-rules/min-length-rule.js' );
const LengthIsRule = read( 'common-rules/length-is-rule.js' );
const MaxValueRule = read( 'common-rules/max-value-rule.js' );
const MinValueRule = read( 'common-rules/min-value-rule.js' );
const ExpressionRule = read( 'common-rules/expression-rule.js' );
const DependencyRule = read( 'common-rules/dependency-rule.js' );
const InformationRule = read( 'common-rules/information-rule.js' );
const NullResultOption = read( 'common-rules/null-result-option.js' );

describe( 'Common rule index', () => {

  const pi = new PropertyInfo( 'property', new Text() );
  const di = new PropertyInfo( 'dependent', new Text() );
  const re = new RegExp( '[-+]?[0-9]*\.?[0-9]+', 'g' );

  it( 'properties return correct rules', () => {

    expect( cr.isInRole( AuthorizationAction.createObject, null, 'developers' ) ).toEqual( jasmine.any( IsInRoleRule ) );
    expect( cr.isInAnyRole( AuthorizationAction.createObject, null, [ 'managers', 'engineers' ] ) ).toEqual( jasmine.any( IsInAnyRoleRule ) );
    expect( cr.isInAllRoles( AuthorizationAction.createObject, null, [ 'designers', 'testers' ] ) ).toEqual( jasmine.any( IsInAllRolesRule ) );
    expect( cr.isNotInRole( AuthorizationAction.removeObject, null, 'salesmen' ) ).toEqual( jasmine.any( IsNotInRoleRule ) );
    expect( cr.isNotInAnyRole( AuthorizationAction.removeObject, null, [ 'contractors', 'guests' ] ) ).toEqual( jasmine.any( IsNotInAnyRoleRule ) );

    expect( cr.required( pi ) ).toEqual( jasmine.any( RequiredRule ) );
    expect( cr.maxLength( pi, 64 ) ).toEqual( jasmine.any( MaxLengthRule ) );
    expect( cr.minLength( pi, 16 ) ).toEqual( jasmine.any( MinLengthRule ) );
    expect( cr.lengthIs( pi, 32 ) ).toEqual( jasmine.any( LengthIsRule ) );
    expect( cr.maxValue( pi, 'z' ) ).toEqual( jasmine.any( MaxValueRule ) );
    expect( cr.minValue( pi, 'A' ) ).toEqual( jasmine.any( MinValueRule ) );
    expect( cr.expression( pi, re, NullResultOption.returnFalse ) ).toEqual( jasmine.any( ExpressionRule ) );
    expect( cr.dependency( pi, di ) ).toEqual( jasmine.any( DependencyRule ) );
    expect( cr.information( pi, 'message' ) ).toEqual( jasmine.any( InformationRule ) );

    expect( cr.nullResultOption ).toEqual( jasmine.any( Object ) );
  } );
} );
