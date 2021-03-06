//region Imports

const BlanketOrder_S = require( '../../data/simple-mc/blanket-order.js' );
const BlanketOrder_C = require( '../../data/custom-mc/models/blanket-order.js' );

//endregion

function showTitle() {
  console.log( '' );
  console.log( '--------------------------------------------------' );
  console.log( 'Testing fromCto methods...' );
  console.log( '--------------------------------------------------' );
}

describe( 'Using fromCto method', () => {

  //region Data

  const contractDate = new Date( 2014, 12, 15, 15, 26 );
  const contractDate_u = new Date( 2014, 12, 20, 8, 40 );
  const expiry1 = new Date( 2015, 1, 1, 0, 0 );
  const expiry2 = new Date( 2015, 3, 21, 0, 0 );
  const shipDate1 = new Date( 2015, 1, 8, 12, 0 );
  const shipDate2 = new Date( 2015, 2, 28, 16, 30 );

  //endregion

  //region Compose data for insert

  const data1 = {
    vendorName: 'Acme Corp.',
    contractDate: contractDate,
    totalPrice: 497.5,
    schedules: 2,
    enabled: true
  };
  data1.address = {
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    line1: '100 Front Street W',
    line2: '',
    postalCode: 'M5J 1E3'
  };
  data1.items = [];
  data1.items.push( {
    productName: 'Tablet Creek 7',
    obsolete: false,
    expiry: expiry1,
    quantity: 2,
    unitPrice: 200
  } );
  data1.items.push( {
    productName: 'USB 3.0 cable',
    obsolete: false,
    expiry: expiry2,
    quantity: 5,
    unitPrice: 19.5
  } );
  data1.items[ 1 ].schedules = [];
  data1.items[ 1 ].schedules.push( {
    quantity: 2,
    totalMass: 0.24,
    required: true,
    shipTo: 'Madrid',
    shipDate: shipDate1
  } );
  data1.items[ 1 ].schedules.push( {
    quantity: 3,
    totalMass: 0.36,
    required: true,
    shipTo: 'Copenhagen',
    shipDate: shipDate2
  } );

  //endregion

  it( 'to create a simple editable model', done => {
    showTitle();
    console.log( '\n*** Rebuild a simple model to be created' );

    BlanketOrder_S.create()
      .then( order => {

        order.fromCto( data1 )
          .then( () => {

            order.save()
              .then( order => {

                //region Check data

                expect( order.orderKey ).toBe( 3 );
                expect( order.vendorName ).toBe( 'Acme Corp.' );
                expect( order.contractDate ).toBe( contractDate );
                expect( order.totalPrice ).toBe( 497.5 );
                expect( order.schedules ).toBe( 2 );
                expect( order.enabled ).toBe( true );
                expect( order.createdDate.getDate() ).toBe( new Date().getDate() );
                expect( order.modifiedDate ).toBeNull();

                const address = order.address;

                expect( address.addressKey ).toBe( 3 );
                expect( address.orderKey ).toBe( 3 );
                expect( address.country ).toBe( 'Canada' );
                expect( address.state ).toBe( 'Ontario' );
                expect( address.city ).toBe( 'Toronto' );
                expect( address.line1 ).toBe( '100 Front Street W' );
                expect( address.line2 ).toBe( '' );
                expect( address.postalCode ).toBe( 'M5J 1E3' );

                expect( order.items.count ).toBe( 2 );

                const item1 = order.items.at( 0 );

                expect( item1.orderItemKey ).toBe( 7 );
                expect( item1.orderKey ).toBe( 3 );
                expect( item1.productName ).toBe( 'Tablet Creek 7' );
                expect( item1.obsolete ).toBe( false );
                expect( item1.expiry ).toBe( expiry1 );
                expect( item1.quantity ).toBe( 2 );
                expect( item1.unitPrice ).toBe( 200 );

                const item2 = order.items.at( 1 );

                expect( item2.orderItemKey ).toBe( 8 );
                expect( item2.orderKey ).toBe( 3 );
                expect( item2.productName ).toBe( 'USB 3.0 cable' );
                expect( item2.obsolete ).toBe( false );
                expect( item2.expiry ).toBe( expiry2 );
                expect( item2.quantity ).toBe( 5 );
                expect( item2.unitPrice ).toBe( 19.5 );

                expect( item1.schedules.count ).toBe( 0 );

                expect( item2.schedules.count ).toBe( 2 );

                const schedule1 = item2.schedules.at( 0 );

                expect( schedule1.orderScheduleKey ).toBe( 9 );
                expect( schedule1.orderItemKey ).toBe( 8 );
                expect( schedule1.quantity ).toBe( 2 );
                expect( schedule1.totalMass ).toBe( 0.24 );
                expect( schedule1.required ).toBe( true );
                expect( schedule1.shipTo ).toBe( 'Madrid' );
                expect( schedule1.shipDate ).toBe( shipDate1 );

                const schedule2 = item2.schedules.at( 1 );

                expect( schedule2.orderScheduleKey ).toBe( 10 );
                expect( schedule2.orderItemKey ).toBe( 8 );
                expect( schedule2.quantity ).toBe( 3 );
                expect( schedule2.totalMass ).toBe( 0.36 );
                expect( schedule2.required ).toBe( true );
                expect( schedule2.shipTo ).toBe( 'Copenhagen' );
                expect( schedule2.shipDate ).toBe( shipDate2 );

                //endregion

                done();
              } );
        } );
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'to update a simple editable model', done => {
    console.log( '\n*** Rebuild a simple model to be updated' );

    //region Compose data for update

    const data2 = {
      orderKey: 3,
      vendorName: 'Summit Ltd.',
      contractDate: contractDate_u,
      totalPrice: 672.5,
      schedules: 3,
      enabled: false
    };
    data2.address = {
      addressKey: 3,
      orderKey: 3,
      country: 'Ireland',
      state: '',
      city: 'Dublin',
      line1: '79-81 Iona Rd',
      line2: '',
      postalCode: '9'
    };
    data2.items = [];
    data2.items.push( {
      orderItemKey: 8,
      orderKey: 3,
      productName: 'USB 3.0 hub',
      obsolete: true,
      expiry: expiry1,
      quantity: 11,
      unitPrice: 49.5
    } );
    data2.items.push( {
      productName: 'DataExpert 32GB pen drive',
      obsolete: false,
      expiry: expiry2,
      quantity: 4,
      unitPrice: 32.0
    } );
    data2.items[ 0 ].schedules = [];
    data2.items[ 0 ].schedules.push( {
      orderScheduleKey: 10,
      orderItemKey: 8,
      quantity: 4,
      totalMass: 0.48,
      required: false,
      shipTo: 'Stockholm',
      shipDate: shipDate1
    } );
    data2.items[ 0 ].schedules.push( {
      quantity: 7,
      totalMass: 0.84,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    } );
    data2.items[ 1 ].schedules = [];
    data2.items[ 1 ].schedules.push( {
      quantity: 4,
      totalMass: 0.06,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    } );

    //endregion

    BlanketOrder_S.get( 3 )
      .then( order => {

        order.fromCto( data2 ).then( () => {

          order.save()
            .then( order => {

              //region Check data

              expect( order.orderKey ).toBe( 3 );
              expect( order.vendorName ).toBe( 'Summit Ltd.' );
              expect( order.contractDate ).toBe( contractDate_u );
              expect( order.totalPrice ).toBe( 672.5 );
              expect( order.schedules ).toBe( 3 );
              expect( order.enabled ).toBe( false );
              expect( order.createdDate.getDate() ).toBe( new Date().getDate() );
              expect( order.modifiedDate.getDate() ).toBe( new Date().getDate() );

              expect( order.items.count ).toBe( 2 );

              const item1 = order.items.at( 0 );

              expect( item1.orderItemKey ).toBe( 8 );
              expect( item1.orderKey ).toBe( 3 );
              expect( item1.productName ).toBe( 'USB 3.0 hub' );
              expect( item1.obsolete ).toBe( true );
              expect( item1.expiry ).toBe( expiry1 );
              expect( item1.quantity ).toBe( 11 );
              expect( item1.unitPrice ).toBe( 49.5 );

              const item2 = order.items.at( 1 );

              expect( item2.orderItemKey ).toBe( 9 );
              expect( item2.orderKey ).toBe( 3 );
              expect( item2.productName ).toBe( 'DataExpert 32GB pen drive' );
              expect( item2.obsolete ).toBe( false );
              expect( item2.expiry ).toBe( expiry2 );
              expect( item2.quantity ).toBe( 4 );
              expect( item2.unitPrice ).toBe( 32.0 );

              expect( item1.schedules.count ).toBe( 2 );

              const schedule1 = item1.schedules.at( 0 );

              expect( schedule1.orderScheduleKey ).toBe( 10 );
              expect( schedule1.orderItemKey ).toBe( 8 );
              expect( schedule1.quantity ).toBe( 4 );
              expect( schedule1.totalMass ).toBe( 0.48 );
              expect( schedule1.required ).toBe( false );
              expect( schedule1.shipTo ).toBe( 'Stockholm' );
              expect( schedule1.shipDate ).toBe( shipDate1 );

              const schedule2 = item1.schedules.at( 1 );

              expect( schedule2.orderScheduleKey ).toBe( 11 );
              expect( schedule2.orderItemKey ).toBe( 8 );
              expect( schedule2.quantity ).toBe( 7 );
              expect( schedule2.totalMass ).toBe( 0.84 );
              expect( schedule2.required ).toBe( true );
              expect( schedule2.shipTo ).toBe( 'Vienna' );
              expect( schedule2.shipDate ).toBe( shipDate2 );

              expect( item2.schedules.count ).toBe( 1 );

              const schedule3 = item2.schedules.at( 0 );

              expect( schedule3.orderScheduleKey ).toBe( 12 );
              expect( schedule3.orderItemKey ).toBe( 9 );
              expect( schedule3.quantity ).toBe( 4 );
              expect( schedule3.totalMass ).toBe( 0.06 );
              expect( schedule3.required ).toBe( true );
              expect( schedule3.shipTo ).toBe( 'Vienna' );
              expect( schedule3.shipDate ).toBe( shipDate2 );

              //endregion

              done();
            } );
        } );
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'to create a custom editable model', done => {
    console.log( '\n*** Rebuild a custom model to be created' );

    BlanketOrder_C.create()
      .then( order => {

        order.fromCto( data1 )
          .then( () => {

            if (order.isValid())
              order.save()
                .then( order => {

                  //region Check data

                  expect( order.orderKey ).toBe( 4 );
                  expect( order.vendorName ).toBe( 'Acme Corp.' );
                  expect( order.contractDate ).toBe( contractDate );
                  expect( order.totalPrice ).toBe( 497.5 );
                  expect( order.schedules ).toBe( 2 );
                  expect( order.enabled ).toBe( true );
                  expect( order.createdDate.getDate() ).toBe( new Date().getDate() );
                  expect( order.modifiedDate ).toBeNull();

                  const address = order.address;

                  expect( address.addressKey ).toBe( 4 );
                  expect( address.orderKey ).toBe( 4 );
                  expect( address.country ).toBe( 'Canada' );
                  expect( address.state ).toBe( 'Ontario' );
                  expect( address.city ).toBe( 'Toronto' );
                  expect( address.line1 ).toBe( '100 Front Street W' );
                  expect( address.line2 ).toBe( '' );
                  expect( address.postalCode ).toBe( 'M5J 1E3' );

                  expect( order.items.count ).toBe( 2 );

                  const item1 = order.items.at( 0 );

                  expect( item1.orderItemKey ).toBe( 10 );
                  expect( item1.orderKey ).toBe( 4 );
                  expect( item1.productName ).toBe( 'Tablet Creek 7' );
                  expect( item1.obsolete ).toBe( false );
                  expect( item1.expiry ).toBe( expiry1 );
                  expect( item1.quantity ).toBe( 2 );
                  expect( item1.unitPrice ).toBe( 200 );

                  const item2 = order.items.at( 1 );

                  expect( item2.orderItemKey ).toBe( 11 );
                  expect( item2.orderKey ).toBe( 4 );
                  expect( item2.productName ).toBe( 'USB 3.0 cable' );
                  expect( item2.obsolete ).toBe( false );
                  expect( item2.expiry ).toBe( expiry2 );
                  expect( item2.quantity ).toBe( 5 );
                  expect( item2.unitPrice ).toBe( 19.5 );

                  expect( item1.schedules.count ).toBe( 0 );

                  expect( item2.schedules.count ).toBe( 2 );

                  const schedule1 = item2.schedules.at( 0 );

                  expect( schedule1.orderScheduleKey ).toBe( 13 );
                  expect( schedule1.orderItemKey ).toBe( 11 );
                  expect( schedule1.quantity ).toBe( 2 );
                  expect( schedule1.totalMass ).toBe( 0.24 );
                  expect( schedule1.required ).toBe( true );
                  expect( schedule1.shipTo ).toBe( 'Madrid' );
                  expect( schedule1.shipDate ).toBe( shipDate1 );

                  const schedule2 = item2.schedules.at( 1 );

                  expect( schedule2.orderScheduleKey ).toBe( 14 );
                  expect( schedule2.orderItemKey ).toBe( 11 );
                  expect( schedule2.quantity ).toBe( 3 );
                  expect( schedule2.totalMass ).toBe( 0.36 );
                  expect( schedule2.required ).toBe( true );
                  expect( schedule2.shipTo ).toBe( 'Copenhagen' );
                  expect( schedule2.shipDate ).toBe( shipDate2 );

                  //endregion

                  done();
                } );
          } );
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'to update a custom editable model', done => {
    console.log( '\n*** Rebuild a custom model to be updated' );

    //region Compose data for update

    const data3 = {
      orderKey: 4,
      vendorName: 'Summit Ltd.',
      contractDate: contractDate_u,
      totalPrice: 672.5,
      schedules: 3,
      enabled: false
    };
    data3.address = {
      addressKey: 4,
      orderKey: 4,
      country: 'Ireland',
      state: '',
      city: 'Dublin',
      line1: '79-81 Iona Rd',
      line2: '',
      postalCode: '9'
    };
    data3.items = [];
    data3.items.push( {
      orderItemKey: 11,
      orderKey: 4,
      productName: 'USB 3.0 hub',
      obsolete: true,
      expiry: expiry1,
      quantity: 11,
      unitPrice: 49.5
    } );
    data3.items.push( {
      productName: 'DataExpert 32GB pen drive',
      obsolete: false,
      expiry: expiry2,
      quantity: 4,
      unitPrice: 32.0
    } );
    data3.items[ 0 ].schedules = [];
    data3.items[ 0 ].schedules.push( {
      orderScheduleKey: 14,
      orderItemKey: 11,
      quantity: 4,
      totalMass: 0.48,
      required: false,
      shipTo: 'Stockholm',
      shipDate: shipDate1
    } );
    data3.items[ 0 ].schedules.push( {
      quantity: 7,
      totalMass: 0.84,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    } );
    data3.items[ 1 ].schedules = [];
    data3.items[ 1 ].schedules.push( {
      quantity: 4,
      totalMass: 0.06,
      required: true,
      shipTo: 'Vienna',
      shipDate: shipDate2
    } );

    //endregion

    BlanketOrder_C.get( 4 )
      .then( order => {

        order.fromCto( data3 )
          .then( () => {

            order.save()
              .then( order => {

                //region Check data

                expect( order.orderKey ).toBe( 4 );
                expect( order.vendorName ).toBe( 'Summit Ltd.' );
                expect( order.contractDate ).toBe( contractDate_u );
                expect( order.totalPrice ).toBe( 672.5 );
                expect( order.schedules ).toBe( 3 );
                expect( order.enabled ).toBe( false );
                expect( order.createdDate.getDate() ).toBe( new Date().getDate() );
                expect( order.modifiedDate.getDate() ).toBe( new Date().getDate() );

                expect( order.items.count ).toBe( 2 );

                const item1 = order.items.at( 0 );

                expect( item1.orderItemKey ).toBe( 11 );
                expect( item1.orderKey ).toBe( 4 );
                expect( item1.productName ).toBe( 'USB 3.0 hub' );
                expect( item1.obsolete ).toBe( true );
                expect( item1.expiry ).toBe( expiry1 );
                expect( item1.quantity ).toBe( 11 );
                expect( item1.unitPrice ).toBe( 49.5 );

                const item2 = order.items.at( 1 );

                expect( item2.orderItemKey ).toBe( 12 );
                expect( item2.orderKey ).toBe( 4 );
                expect( item2.productName ).toBe( 'DataExpert 32GB pen drive' );
                expect( item2.obsolete ).toBe( false );
                expect( item2.expiry ).toBe( expiry2 );
                expect( item2.quantity ).toBe( 4 );
                expect( item2.unitPrice ).toBe( 32.0 );

                expect( item1.schedules.count ).toBe( 2 );

                const schedule1 = item1.schedules.at( 0 );

                expect( schedule1.orderScheduleKey ).toBe( 14 );
                expect( schedule1.orderItemKey ).toBe( 11 );
                expect( schedule1.quantity ).toBe( 4 );
                expect( schedule1.totalMass ).toBe( 0.48 );
                expect( schedule1.required ).toBe( false );
                expect( schedule1.shipTo ).toBe( 'Stockholm' );
                expect( schedule1.shipDate ).toBe( shipDate1 );

                const schedule2 = item1.schedules.at( 1 );

                expect( schedule2.orderScheduleKey ).toBe( 15 );
                expect( schedule2.orderItemKey ).toBe( 11 );
                expect( schedule2.quantity ).toBe( 7 );
                expect( schedule2.totalMass ).toBe( 0.84 );
                expect( schedule2.required ).toBe( true );
                expect( schedule2.shipTo ).toBe( 'Vienna' );
                expect( schedule2.shipDate ).toBe( shipDate2 );

                expect( item2.schedules.count ).toBe( 1 );

                const schedule3 = item2.schedules.at( 0 );

                expect( schedule3.orderScheduleKey ).toBe( 16 );
                expect( schedule3.orderItemKey ).toBe( 12 );
                expect( schedule3.quantity ).toBe( 4 );
                expect( schedule3.totalMass ).toBe( 0.06 );
                expect( schedule3.required ).toBe( true );
                expect( schedule3.shipTo ).toBe( 'Vienna' );
                expect( schedule3.shipDate ).toBe( shipDate2 );

                //endregion

                done();
              } );
          } );
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );
} );
