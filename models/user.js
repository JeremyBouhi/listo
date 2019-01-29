var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    trips: [],
    badges: [],
    progress: {type: Number, required:true},
    avatar: {type: Number, required:true},
    level: {type: String, required:true}
})

var User = mongoose.model('User', userSchema);

module.exports = User;
