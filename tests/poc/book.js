const Model = require( './model.js' );

const properties = [ 'publisher', 'title', 'author', 'releaseDate', 'price' ];

class Book extends Model {
  
  constructor() {
    super( properties );
  }
  
  toString() {
    return this.author + ': ' + this.title +
      ' (' + this.publisher + ', ' + this.releaseDate + ') - ' + this.price;
  }
}

module.exports = Book;
