var mongoose = require('mongoose');

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    dates : {type : String, default: ''},
    destination : {
        validated : {type : Boolean, default: 0},
        deadline: {type : Date},
        final_destination: {type : String, default: ''},
        destinations_survey: [{
            destination_name: {type : String, default: ''},
            votes_number: {type : Number, default: 0}
        }]
    },
    admin : {type : String, default: ''}
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
