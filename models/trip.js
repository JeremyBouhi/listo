var mongoose = require('mongoose');

import dateSchema from './date';

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    date : {
        validated : {type : Boolean, default: 0},
        deadline: {type : Date},
        final_date: [dateSchema],
        dates_survey: [{
            start_date: [dateSchema],
            end_date: [dateSchema],
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
    toDoList:[{
        description: {type:String, required:true},
        difficulte: {type:Number, required:true},
        usersInvolved:[]
    }],
    bringList:[{
        description: {type:String, required:true},
        difficulte: {type:Number, required:true},
        usersInvolved:[]
    }]
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
