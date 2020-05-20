require( 'dotenv' ).config();
const fetch = require( 'node-fetch' );
const Geocodio = require( 'geocodio-library-node' );
const fs = require( 'fs' );
const path = require( 'path' );


const geocoder = new Geocodio( process.env.GEOCODIO_API_KEY );
const DEV_MODE = false;
const { FILE_PATH } = process.env;
const getCustomers = ( cursor, customers ) => {
  let url = 'https://connect.squareup.com/v2/customers';
  if ( cursor ) url = `${url}?cursor=${cursor}`;

  return fetch( url, {
    method: 'GET',
    headers: {
      'square-version': '2020-04-22',
      authorization: process.env.TOKEN,
      'content-type': 'application/json',
    },
  } ).then( response => response.json() )
    .then( ( result ) => {
      if ( result.cursor ) return getCustomers( result.cursor, customers.concat( result.customers ) );
      return customers;
    } ).catch( ( err ) => {
      console.log( err );
    } );
};

const sortCountry = ( countryCode, postal ) => {
  // Sort by country code first
  const lookup = { CA: 'Canada', US: 'United States' };
  let country = lookup[countryCode] ? lookup[countryCode] : countryCode;

  // double check via postal code
  const us = new RegExp( '^\\d{5}(-{0,1}\\d{4})?$' );
  const ca = new RegExp( /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i );
  if ( us.test( postal ) ) country = 'United States';
  if ( ca.test( postal ) ) country = 'Canada';
  return country;
};

const getAddresses = ( customers ) => {
  const addresses = customers
    .filter( customer => customer.address ).reduce( ( obj, addressedCustomer ) => {
      const { address, given_name, family_name } = addressedCustomer;
      const country = sortCountry( address.country, address.postal_code );
      const name = `${given_name} ${family_name}`;
      const sanitizedAddr = `${address.address_line_1}, ${address.locality}, ${address.postal_code}, ${country}`;
      obj[name] = sanitizedAddr;
      return obj;
    }, {} );
  return addresses;
};

const getGeocodes = ( addresses, devMode ) => {
  const addrList = addresses;
  if ( devMode ) {
    Object.keys( addrList ).forEach( ( key, index ) => {
      if ( index > 2 ) {
        delete addrList[key];
      }
    } );
  }
  geocoder.geocode( addrList )
    .then( ( response ) => {
      const latLngArr = [];
      const keys = ( Object.keys( response.results ) );
      for ( let i = 0; i < keys.length; i++ ) {
        latLngArr.push( {
          name: keys[i],
          latlng: response.results[keys[i]].response.results[0].location,
        } );
      }
      fs.writeFileSync( FILE_PATH, JSON.stringify( latLngArr ) );
    } );
};

getCustomers( null, [] ).then( ( customers ) => {
  const addresses = getAddresses( customers );
  getGeocodes( addresses, DEV_MODE );
} ).catch( ( err ) => {
  console.log( err );
} );

