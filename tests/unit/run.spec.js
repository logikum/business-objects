
const Model = require( './model.js' );

const ModelToyota = new Model( 'Toyota' );
const t_Corolla = new ModelToyota( 'Corolla' );
const t_Avensis = new ModelToyota( 'Avensis' );
const ModelFord = new Model( 'Ford' );
const f_Focus = new ModelFord( 'Focus' );

console.log(t_Corolla.brand + ': ' + t_Corolla.name);
console.log(t_Avensis.brand + ': ' + t_Avensis.name);
console.log(f_Focus.brand + ': ' + f_Focus.name);
