var mongoose = require('mongoose');

// import dateSchema from './date';

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    date : {
        validated : {type : Boolean, default: 0},
        deadline: {type : Date},
        final_date: {
            year: {type:Number, required:true},
            month: {type:Number, required:true},
            day: {type:Number, required:true}
        },
        dates_survey: [{
            start_date: {
                year: {type:Number, required:true},
                month: {type:Number, required:true},
                day: {type:Number, required:true}
            },
            end_date: {
                year: {type:Number, required:true},
                month: {type:Number, required:true},
                day: {type:Number, required:true}
            },
            user_id: {type : String, default: ''}
        }]
    },
    destination : {
        validated : {type : Boolean, default: 0},
        deadline: {type : Date},
        final_destination: {type : String, default: ''},
        destinations_survey: [{
            destination_name: {type : String, default: ''},
            votes_number: {type : Number, default: 0}
        }]
    },
    admin : {type : String, default: ''},
    toDoList:{type: mongoose.Schema.Types.ObjectId, ref: 'List'}
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
