var mongoose = require('mongoose');

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    dates : {type : String, default: ''},
    destination : {type : String, default: ''}
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;