var mongoose = require('mongoose');

// import dateSchema from './date';
// import budgetSchema from './budget';

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
        survey: [{
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
            users_id: []
        }]
    },
    destination : {
        validated : {type : Boolean, default: 0},
        deadline: {type : Date},
        final_destination: {type : String, default: ''},
        survey: [{
            destination_name: {type : String, default: ''},
            users_id: []
        }]
    },
    admin : {type : String, default: ''},
    toDoList:[{
        description: {type:String, default: ''},
        difficulty: {type:Number, default: ''},
        usersInvolved:[]
    }],
    bringList:[{
        description: {type:String, default: ''},
        difficulty: {type:Number, default: 0},
        usersInvolved:[]
    }],
    users: [{
        budget: {
            transportation: {type:Number, default: 0},
            accommodation: {type:Number, default: 0},
            on_the_spot: {type:Number, default: 0},
            total: {type:Number, default: 0}
        }
    }],
    budget: {
        transportation: {type:Number, default: 0},
        accommodation: {type:Number, default: 0},
        on_the_spot: {type:Number, default: 0},
        total: {type:Number, default: 0}
    }
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
