const Book = require( './book.js' );

const b1 = new Book();
b1.author = 'Móra Ferenc';
b1.title = 'Sárarany';
b1.publisher = 'Pergamen Kiadó';
b1.releaseDate = '1922';
b1.price = '4000 Ft';

b1.listProperties( false );
console.log( b1.author );
console.log( b1.title );
console.log( b1.publisher );
console.log( b1.releaseDate );
console.log( b1.price );
console.log( b1.toString() );
b1.listProperties( true );

// **********

const b2 = new Book();
b2.author = 'China Miéville';
b2.title = 'Kraken';
b2.publisher = 'Bantham Press';
b2.releaseDate = '2007';
b2.price = '$45';

b2.listProperties( false );
console.log( b2.author );
console.log( b2.title );
console.log( b2.publisher );
console.log( b2.releaseDate );
console.log( b2.price );
console.log( b2.toString() );
b2.listProperties( true );

// **********

b1.listProperties( false );
console.log( b1.author );
console.log( b1.title );
console.log( b1.publisher );
console.log( b1.releaseDate );
console.log( b1.price );
console.log( b1.toString() );
b1.listProperties( true );
