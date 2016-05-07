'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const DaoBase = require( '../../source/data-access/dao-base.js' );
const Argument = require( '../../source/system/argument-check.js' );

const daoBuilder = function ( dataSource, modelPath, modelName ) {

  if (typeof dataSource !== 'string' || dataSource.trim().length === 0)
    throw new Error( 'The dataSource argument of daoBuilder function must be a non-empty string.' );

  if (typeof modelPath !== 'string' || modelPath.trim().length === 0)
    throw new Error( 'The modelPath argument of daoBuilder function must be a non-empty string.' );

  if (typeof modelName !== 'string' || modelName.trim().length === 0)
    throw new Error( 'The modelName argument of daoBuilder function must be a non-empty string.' );

  const modelStats = fs.statSync( modelPath );
  if (!modelStats.isFile())
    throw new Error( 'The modelPath argument of daoBuilder function is not a valid file path: ' + modelPath );

  const daoPath = path.join( __dirname, dataSource, path.basename( modelPath ) );

  const daoStats = fs.statSync( daoPath );
  if (!daoStats.isFile())
    throw new Error( 'The required data access file does not exist: ' + daoPath );

  const daoCtor = require( daoPath );

  if (typeof daoCtor !== 'function')
    throw new Error( 'The data access file must return a constructor: ' + daoPath );

  return Argument.check( new daoCtor() ).forMandatory()
    .asType( DaoBase, daoPath + ' must inherit DaoBase type.' );
};

module.exports = daoBuilder;
