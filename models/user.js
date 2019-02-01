var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    trips: [],
    badges: {
        destination: {type:Number, default:0},
        date: {type:Number, default:0},
        winner: {type:Number, default:0},
        loser: {type:Number, default:0},
        budget: {type:Number, default:0},
        admin: {type:Number, default:0},
        level1: {type:Boolean, default:false}, // Marin d'eau douce
        level2: {type:Boolean, default:false}, // Moussaillon
        level3: {type:Boolean, default:false}, // Vigie
        level4: {type:Boolean, default:false}, // Cannonier
        level5: {type:Boolean, default:false}, // Timonier (barreur)
        level6: {type:Boolean, default:false}, // Capitaine
        level7: {type:Boolean, default:false},  // Barbe Noir
        level_max: {type:Boolean, default:false} // Seigneur des pirates
    },
    progress: {type: Number, required:true},
    avatar: {type: Number, required:true},
    level: {type: String, required:true}
})

var User = mongoose.model('User', userSchema);

module.exports = User;
