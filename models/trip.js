var mongoose = require('mongoose');

// import dateSchema from './date';
// import budgetSchema from './budget';

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    date : {
        validated : {type : Boolean, default: 0},
        deadline: Date,
        final_date: String,
        survey: [{
            start_date: String,
            end_date: String,
            color: String,
            users_id: [],
            custom_id : String
        },{
            _id : false
        }]
    },
    destination : {
        validated : {type : Boolean, default: 0},
        deadline: Date,
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
        status:{type:Boolean,default:false},
        usersInvolved:[]
    }],
    bringList:[{
        description: {type:String, default: ''},
        difficulty: {type:Number, default: 0},
        status:{type:Boolean,default:false},
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
    },
    badges: {
        destination: {type:String, default:''},
        date: {type:String, default:''},
        winner:{type:String, default:''},
        loser:{type:String, default:''},
        budget:{type:String, default:''},
        admin:{type:String, default:''}
    }
});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
