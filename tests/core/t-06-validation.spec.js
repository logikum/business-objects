//region Imports

const BlanketOrder = require( '../../data/simple-core/blanket-order.js' );
const BlanketOrders = require( '../../data/simple-core/blanket-orders.js' );
const BlanketOrderView = require( '../../data/validation/models/blanket-order-view.js' );
const BlanketOrderList = require( '../../data/validation/models/blanket-order-list.js' );

//endregion

function showTitle() {
  console.log( '' );
  console.log( '--------------------------------------------------' );
  console.log( 'Testing validation of simple models...' );
  console.log( '--------------------------------------------------' );
}

describe( 'Business object validation for', () => {

  //region Data

  const contractDate = new Date( 2014, 12, 15, 15, 26 );
  const contractDate_u = new Date( 2014, 12, 20, 8, 40 );
  const expiry1 = new Date( 2015, 1, 1, 0, 0 );
  const expiry2 = new Date( 2015, 3, 21, 0, 0 );
  const shipDate1 = new Date( 2015, 1, 8, 12, 0 );
  const shipDate2 = new Date( 2015, 2, 28, 16, 30 );

  //endregion

  it( 'editable model', done => {
    showTitle();
    console.log( '\n*** Editable object' );

    BlanketOrder.create()
      .then( order => {

        //region Load data

        //order.vendorName = 'Acme Corp.';
        order.contractDate = contractDate;
        order.totalPrice = 497.5;
        order.schedules = 2;
        order.enabled = true;

        const address = order.address;

        address.country = 'Canada';
        address.state = 'Ontario';
        // address.city = 'Toronto';
        address.line1 = '100 Front Street W';
        address.line2 = '';
        address.postalCode = 'M5J 1E3';

        order.items.createItem()
          .then( item1 => {

            item1.productName = 'Tablet Creek 7';
            item1.obsolete = false;
            // item1.expiry = expiry1;
            item1.quantity = 2;
            item1.unitPrice = 200;

            order.items.createItem()
              .then( item2 => {

                item2.productName = 'USB 3.0 cable';
                item2.obsolete = false;
                item2.expiry = expiry2;
                item2.quantity = 5;
                item2.unitPrice = 19.5;

                item2.schedules.createItem()
                  .then( schedule1 => {

                    schedule1.quantity = 2;
                    schedule1.totalMass = 0.24;
                    schedule1.required = true;
                    schedule1.shipTo = 'Madrid';
                    schedule1.shipDate = shipDate1;

                    item2.schedules.createItem()
                      .then( schedule2 => {

                        schedule2.quantity = 3;
                        //schedule2.totalMass = 0.36;
                        schedule2.required = true;
                        // schedule2.shipTo = 'Copenhagen';
                        schedule2.shipDate = shipDate2;

                        checkRules();
                      } );
                  } );
              } );
          } );

        //endregion

        function checkRules() {

          order.checkRules();

          //region Check data

          expect( order.isValid() ).toBe( false );

          const bro = order.getBrokenRules();
          const vendor = bro[ 'BlanketOrder.vendorName' ];

          expect( vendor.length ).toBe( 1 );
          expect( vendor[ 0 ].message ).toBe( 'Property vendorName is required.' );
          expect( vendor[ 0 ].severity ).toBe( 3 );

          const address = bro[ 'address' ];
          const city = address[ 'Address.city' ];

          expect( city.length ).toBe( 1 );
          expect( city[ 0 ].message ).toBe( 'Property city is required.' );
          expect( city[ 0 ].severity ).toBe( 3 );

          const items = bro[ 'items' ];
          const item0 = items[ '00000' ];
          const expiry = item0[ 'BlanketOrderItem.expiry' ];

          expect( expiry.length ).toBe( 1 );
          expect( expiry[ 0 ].message ).toBe( 'Property expiry is required.' );
          expect( expiry[ 0 ].severity ).toBe( 3 );

          const item1 = items[ '00001' ];
          const schedules = item1[ 'schedules' ];
          const schedule0 = schedules[ '00001' ];
          const totalMass = schedule0[ 'BlanketOrderSchedule.totalMass' ];

          expect( totalMass.length ).toBe( 1 );
          expect( totalMass[ 0 ].message ).toBe( 'Property totalMass is required.' );
          expect( totalMass[ 0 ].severity ).toBe( 3 );

          const shipTo = schedule0[ 'BlanketOrderSchedule.shipTo' ];

          expect( shipTo.length ).toBe( 1 );
          expect( shipTo[ 0 ].message ).toBe( 'Property shipTo is required.' );
          expect( shipTo[ 0 ].severity ).toBe( 3 );

          const brr = order.getResponse( 'Review your data and correct them where necessary!' );

          expect( brr.name ).toBe( 'BrokenRules' );
          expect( brr.status ).toBe( 422 );
          expect( brr.message ).toBe( 'Review your data and correct them where necessary!' );
          expect( brr.length ).toBe( 3 );
          expect( brr.count ).toBe( 5 );
          expect( brr.data ).toEqual( bro );

          console.log( '  > Broken rules response\n' + JSON.stringify( brr ) );

          //endregion

          global.t06order = order.toCto();

          done();
        }
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'editable collection', done => {
    console.log( '\n*** Editable collection' );

    //region Load data

    function createOrder1( list ) {
      console.log( '    < Create order #1 >' );
      return list.createItem().then( order1 => {

        order1.vendorName = 'Blue Zebra';
        //order1.contractDate = contractDate1;
        order1.totalPrice = 400.0;
        order1.schedules = 2;
        order1.enabled = true;

        const address1 = order1.address;

        address1.country = 'Italia';
        address1.state = '';
        address1.city = 'Milano';
        //address1.line1 = 'Via Battistotti Sassi 11/A';
        address1.line2 = '';
        address1.postalCode = '20133';

        return Promise.all( [
          createItem1( order1.items ),
          createItem2( order1.items )
        ] ).then( items => {
          return order1;
        } );
      } );
    }

    function createItem1( items ) {
      return items.createItem().then( item1 => {

        //item1.productName = 'D810A';
        item1.obsolete = false;
        item1.expiry = expiry1;
        item1.quantity = 10;
        item1.unitPrice = 30;

        return Promise.all( [
          createSchedule1( item1.schedules ),
          createSchedule2( item1.schedules )
        ] ).then( schedules => {
          return item1;
        } );
      } );
    }

    function createItem2( items ) {
      return items.createItem().then( item2 => {

        item2.productName = 'R8';
        item2.obsolete = false;
        item2.expiry = expiry2;
        item2.quantity = 5;
        //item2.unitPrice = 20;

        return item2;
      } );
    }

    function createSchedule1( schedules ) {
      return schedules.createItem().then( schedule1 => {

        //schedule1.quantity = 5;
        schedule1.totalMass = 2.5;
        schedule1.required = true;
        schedule1.shipTo = 'Bologna';
        schedule1.shipDate = shipDate1;

        return schedule1;
      } );
    }

    function createSchedule2( schedules ) {
      return schedules.createItem().then( schedule2 => {

        schedule2.quantity = 5;
        schedule2.totalMass = 2.5;
        schedule2.required = true;
        schedule2.shipTo = 'Verona';
        //schedule2.shipDate = shipDate2;

        return schedule2;
      } );
    }

    function createSchedule3( schedules ) {
      return schedules.createItem().then( schedule3 => {

        schedule3.quantity = 45;
        schedule3.totalMass = 540;
        schedule3.required = false;
        schedule3.shipTo = 'Krakow';
        schedule3.shipDate = shipDate3;

        return schedule3;
      } );
    }

    //endregion

    BlanketOrders.create()
      .then( orders => {
        return createOrder1( orders )
        .then( values => {
          return orders;
        } );
      } )
      .then( orders => {

        orders.checkRules();

        //region Check data

        expect( orders.isValid() ).toBe( false );

        const bro = orders.getBrokenRules();
        const order0 = bro[ '00000' ];
        const contractDate = order0[ 'BlanketOrderChild.contractDate' ];

        expect( contractDate.length ).toBe( 1 );
        expect( contractDate[ 0 ].message ).toBe( 'Property contractDate is required.' );
        expect( contractDate[ 0 ].severity ).toBe( 3 );

        const address = order0[ 'address' ];
        const line1 = address[ 'Address.line1' ];

        expect( line1.length ).toBe( 1 );
        expect( line1[ 0 ].message ).toBe( 'Property line1 is required.' );
        expect( line1[ 0 ].severity ).toBe( 3 );

        const items = order0[ 'items' ];
        const item0 = items[ '00000' ];
        const productName = item0[ 'BlanketOrderItem.productName' ];

        expect( productName.length ).toBe( 1 );
        expect( productName[ 0 ].message ).toBe( 'Property productName is required.' );
        expect( productName[ 0 ].severity ).toBe( 3 );

        const item1 = items[ '00001' ];
        const unitPrice = item1[ 'BlanketOrderItem.unitPrice' ];

        expect( unitPrice.length ).toBe( 1 );
        expect( unitPrice[ 0 ].message ).toBe( 'Property unitPrice is required.' );
        expect( unitPrice[ 0 ].severity ).toBe( 3 );

        const schedules = item0[ 'schedules' ];
        const schedule0 = schedules[ '00000' ];
        const quantity = schedule0[ 'BlanketOrderSchedule.quantity' ];

        expect( quantity.length ).toBe( 1 );
        expect( quantity[ 0 ].message ).toBe( 'Property quantity is required.' );
        expect( quantity[ 0 ].severity ).toBe( 3 );

        const schedule1 = schedules[ '00001' ];
        const shipDate = schedule1[ 'BlanketOrderSchedule.shipDate' ];

        expect( shipDate.length ).toBe( 1 );
        expect( shipDate[ 0 ].message ).toBe( 'Property shipDate is required.' );
        expect( shipDate[ 0 ].severity ).toBe( 3 );

        const brr = orders.getResponse( 'Review your data and correct them where necessary!' );

        expect( brr.name ).toBe( 'BrokenRules' );
        expect( brr.status ).toBe( 422 );
        expect( brr.message ).toBe( 'Review your data and correct them where necessary!' );
        expect( brr.length ).toBe( 1 );
        expect( brr.count ).toBe( 6 );
        expect( brr.data ).toEqual( bro );

        console.log( '  > Broken rules response\n' + JSON.stringify( brr ) );

        //endregion

        global.t06orders = orders.toCto();

        done();
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'read-only model', done => {
    console.log( '\n*** Read-only object' );

    BlanketOrderView.get( 0 )
      .then( orderView => {

        orderView.checkRules();

        //region Check data

        expect( orderView.isValid() ).toBe( false );

        const bro = orderView.getBrokenRules();
        const vendor = bro[ 'BlanketOrderView.vendorName' ];

        expect( vendor.length ).toBe( 1 );
        expect( vendor[ 0 ].message ).toBe( 'Property vendorName is required.' );
        expect( vendor[ 0 ].severity ).toBe( 3 );

        const address = bro[ 'address' ];
        const city = address[ 'AddressView.city' ];

        expect( city.length ).toBe( 1 );
        expect( city[ 0 ].message ).toBe( 'Property city is required.' );
        expect( city[ 0 ].severity ).toBe( 3 );

        const items = bro[ 'items' ];
        const item0 = items[ '00000' ];
        const expiry = item0[ 'BlanketOrderItemView.expiry' ];

        expect( expiry.length ).toBe( 1 );
        expect( expiry[ 0 ].message ).toBe( 'Property expiry is required.' );
        expect( expiry[ 0 ].severity ).toBe( 3 );

        const item1 = items[ '00001' ];
        const schedules = item1[ 'schedules' ];
        const schedule0 = schedules[ '00001' ];
        const totalMass = schedule0[ 'BlanketOrderScheduleView.totalMass' ];

        expect( totalMass.length ).toBe( 1 );
        expect( totalMass[ 0 ].message ).toBe( 'Property totalMass is required.' );
        expect( totalMass[ 0 ].severity ).toBe( 3 );

        const shipTo = schedule0[ 'BlanketOrderScheduleView.shipTo' ];

        expect( shipTo.length ).toBe( 1 );
        expect( shipTo[ 0 ].message ).toBe( 'Property shipTo is required.' );
        expect( shipTo[ 0 ].severity ).toBe( 3 );

        const brr = orderView.getResponse( 'Review your data and correct them where necessary!' );

        expect( brr.name ).toBe( 'BrokenRules' );
        expect( brr.status ).toBe( 422 );
        expect( brr.message ).toBe( 'Review your data and correct them where necessary!' );
        expect( brr.length ).toBe( 3 );
        expect( brr.count ).toBe( 5 );
        expect( brr.data ).toEqual( bro );

        console.log( '  > Broken rules response\n' + JSON.stringify( brr ) );

        //endregion

        done();
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );

  it( 'read-only collection', done => {
    console.log( '\n*** Read-only collection' );

    BlanketOrderList.getAll()
      .then( orderList => {

        orderList.checkRules();

        //region Check data

        expect( orderList.isValid() ).toBe( false );

        const bro = orderList.getBrokenRules();
        const order0 = bro[ '00000' ];
        const contractDate = order0[ 'BlanketOrderListItem.contractDate' ];

        expect( contractDate.length ).toBe( 1 );
        expect( contractDate[ 0 ].message ).toBe( 'Property contractDate is required.' );
        expect( contractDate[ 0 ].severity ).toBe( 3 );

        const address = order0[ 'address' ];
        const line1 = address[ 'AddressView.line1' ];

        expect( line1.length ).toBe( 1 );
        expect( line1[ 0 ].message ).toBe( 'Property line1 is required.' );
        expect( line1[ 0 ].severity ).toBe( 3 );

        const items = order0[ 'items' ];
        const item0 = items[ '00000' ];
        const productName = item0[ 'BlanketOrderItemView.productName' ];

        expect( productName.length ).toBe( 1 );
        expect( productName[ 0 ].message ).toBe( 'Property productName is required.' );
        expect( productName[ 0 ].severity ).toBe( 3 );

        const item1 = items[ '00001' ];
        const unitPrice = item1[ 'BlanketOrderItemView.unitPrice' ];

        expect( unitPrice.length ).toBe( 1 );
        expect( unitPrice[ 0 ].message ).toBe( 'Property unitPrice is required.' );
        expect( unitPrice[ 0 ].severity ).toBe( 3 );

        const schedules = item0[ 'schedules' ];
        const schedule0 = schedules[ '00000' ];
        const quantity = schedule0[ 'BlanketOrderScheduleView.quantity' ];

        expect( quantity.length ).toBe( 1 );
        expect( quantity[ 0 ].message ).toBe( 'Property quantity is required.' );
        expect( quantity[ 0 ].severity ).toBe( 3 );

        const schedule1 = schedules[ '00001' ];
        const shipDate = schedule1[ 'BlanketOrderScheduleView.shipDate' ];

        expect( shipDate.length ).toBe( 1 );
        expect( shipDate[ 0 ].message ).toBe( 'Property shipDate is required.' );
        expect( shipDate[ 0 ].severity ).toBe( 3 );

        const brr = orderList.getResponse( 'Review your data and correct them where necessary!' );

        expect( brr.name ).toBe( 'BrokenRules' );
        expect( brr.status ).toBe( 422 );
        expect( brr.message ).toBe( 'Review your data and correct them where necessary!' );
        expect( brr.length ).toBe( 1 );
        expect( brr.count ).toBe( 6 );
        expect( brr.data ).toEqual( bro );

        console.log( '  > Broken rules response\n' + JSON.stringify( brr ) );

        //endregion

        done();
      } )
      .catch( reason => {
        console.log( reason );
      } );
  } );
} );
