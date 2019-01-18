var mongoose = require('mongoose');

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    dates : {type : String, default: ''},
    destinations : {
        destination_name: {type : String, default: ''},
        votes_number: {type : Number, default: 0},
        validated : {type : Boolean, default: 0}
    },
    admin : {type : String, default: ''},
    toDoList:{type: mongoose.Schema.Types.ObjectId, ref: 'List'}
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
