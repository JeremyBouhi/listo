var mongoose = require('mongoose');

var dateSchema = mongoose.Schema({
    year: Number,
    month: Number,
    day: Number
})

var Date = mongoose.model('Date', dateSchema);

module.exports = dateSchema;
