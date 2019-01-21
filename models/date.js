var mongoose = require('mongoose');

var dateSchema = mongoose.Schema({
    year: {type:Number, default: 0},
    month: {type:Number, default: 0},
    day: {type:Number, default: 0}
} , {
    _id: false,
    strict: 'throw',
    useNestedStrict: true
});

var Date = mongoose.model('Date', dateSchema);

module.exports = dateSchema;
