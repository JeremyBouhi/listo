var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    trips: {type:Array, required:true},
})

var User = mongoose.model('User', userSchema);

module.exports = User;
