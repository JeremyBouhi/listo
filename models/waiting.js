var mongoose = require('mongoose');

var waitingSchema = mongoose.Schema({
    user_id : {type : String, required:false},
    email : {type : String, required:true},
    trip : {type : String, required:true},
    isInDatabase : {type : Boolean, required:true}
});

var Waiting =  mongoose.model('Waiting', waitingSchema);

module.exports = Waiting;
