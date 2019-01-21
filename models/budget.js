var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
    transportation: {type:Number, default: 0},
    accommodation: {type:Number, default: 0},
    on_the_spot: {type:Number, default: 0},
    total: {type:Number, default: 0}
})

var Budget = mongoose.model('Budget', budgetSchema);

module.exports = budgetSchema;
