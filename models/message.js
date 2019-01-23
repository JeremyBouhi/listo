var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    trip_id : {type : String, required:true},
    content : {type : String, required:true},
    sender : {type : String, required:true},
    topic : {type : String, required:true},
    date : {type : Date, required:true}
});

var Message =  mongoose.model('Message', messageSchema);

module.exports = Message;
