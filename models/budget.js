var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
    transportation: Number,
    accommodation: Number,
    on_the_spot: Number,
    total: Number
})

var Budget = mongoose.model('Budget', budgetSchema);

module.exports = budgetSchema;
