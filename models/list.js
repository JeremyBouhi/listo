var mongoose = require('mongoose');

var listElementSchema = mongoose.Schema({
    description: {type:String, required:true},
    difficulte: {type:Number, required:true}
})

var listSchema = mongoose.Schema({
    elements:[listElementSchema],
});

var ListElement = mongoose.model('ListElement', listElementSchema);
var List = mongoose.model('List', listSchema);
module.exports = ListElement;
module.exports = List;
