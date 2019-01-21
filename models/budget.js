var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
    transportation: {type:Number, required:true},
    accommodation: {type:Number, required:true},
    on_the_spot: {type:Number, required:true},
    total: {type:Number, required:true}
})

var Budget = mongoose.model('Budget', budgetSchema);

module.exports = budgetSchema;
