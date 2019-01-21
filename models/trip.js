var mongoose = require('mongoose');

// import dateSchema from './date';
import budgetSchema from './budget';

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    date : {
        validated : {type : Boolean, default: 0},
        deadline: {type : Date},
        final_date: {
            year: {type:Number, default: 0},
            month: {type:Number, default: 0},
            day: {type:Number, default: 0}
        },
        dates_survey: [{
            start_date: {
                year: {type:Number, default: 0},
                month: {type:Number, default: 0},
                day: {type:Number, default: 0}
            },
            end_date: {
                year: {type:Number, default: 0},
                month: {type:Number, default: 0},
                day: {type:Number, default: 0}
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
    toDoList:[{
        description: {type:String, default: ''},
        difficulte: {type:Number, default: ''},
        usersInvolved:[]
    }],
    bringList:[{
        description: {type:String, default: ''},
        difficulte: {type:Number, default: 0},
        usersInvolved:[]
    }],
    users: [{
        budget: [budgetSchema]
    }]
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
