// Show the required content.
function content (url) {
  $.get( '/contents/' + url + '.html', function( data ) {
    $( '#main-content' ).html( data );
  });
  return false;
}
