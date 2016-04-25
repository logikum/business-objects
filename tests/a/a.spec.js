function Peach() {
  this.name = 'egy';
}
Peach.prototype.save = function() {
  return new Promise( (f,r) => {
    f( 'O.K.' );
  });
};

describe('Test', function () {

  it('promise', done => {

    var peach1 = new Peach();
    var peach2 = new Peach();
    var items = [ peach1, peach2 ];

    function one() {
      return Promise.all( [].map( item => {
          return item.save();
        })).then( values => {
          return [ 'Success: length = ' + values.length ];
        });
    }

    one()
      .then( result => {
        console.log( result[0] );
        expect(result.length).toBe(1);
        done();
      })
      .catch( reason => {
        console.log( reason );
        done();
      });

  });
});
