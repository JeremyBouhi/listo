var mongoose = require('mongoose');

var tripSchema = mongoose.Schema({
    name : {type : String, default: ''},
    date : {
        validated : {type : Boolean, default: 0},
        deadline: Date,
        final_start_date: String,
        final_end_date: String,
        survey: [{
            start_date: String,
            end_date: String,
            color: String,
            user_id: String,
            custom_id : String
        }]
    },
    destination : {
        validated : {type : Boolean, default: 0},
        deadline: Date,
        final_destination: {type : String, default: ''},
        survey: [{
            destination_name: {type : String, default: ''},
            user_id: String
        }]
    },
    admin : {type : String, default: ''},
    toDoList:[{
        description: {type:String, default: ''},
        difficulty: {type:Number, default: 0},
        points: {type:Number, default: 0},
        status:{type:Boolean,default:false},
        userInvolved:{type:String, default: ''}
    }],
    bringList:[{
        description: {type:String, default: ''},
        difficulty: {type:Number, default: 0},
        points: {type:Number, default: 0},
        status:{type:Boolean,default:false},
        userInvolved:{type:String, default: ''}
    }],
    users: [{
        budget: {
            transportation: {type:Number, default: 0},
            accommodation: {type:Number, default: 0},
            on_the_spot: {type:Number, default: 0},
            total: {type:Number, default: 0}
        },
        points: {type:Number, default: 0}
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
    },
    state: {type:Number, default: 0},
    ranking:[]

});

var Trip =  mongoose.model('Trip', tripSchema);

module.exports = Trip;
