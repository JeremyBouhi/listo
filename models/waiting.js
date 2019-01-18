var mongoose = require('mongoose');

var waitingSchema = mongoose.Schema({
    email : {type : String, required:true},
    trip : {type : String, required:true}
});

var Waiting =  mongoose.model('Waiting', waitingSchema);

module.exports = Waiting;
