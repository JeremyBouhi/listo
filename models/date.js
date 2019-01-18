var mongoose = require('mongoose');

var dateSchema = mongoose.Schema({
    year: {type:Number, required:true},
    month: {type:Number, required:true},
    day: {type:Number, required:true}
})

var Date = mongoose.model('Date', dateSchema);

module.exports = dateSchema;
