// modules =================================================
var express        = require('express');
var path           = require('path');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var env            = require('dotenv').config()

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 



// Routes ===========================================
var userRoutes = require(path.join(__dirname, 'routes', 'user'));
var tripRoutes = require(path.join(__dirname, 'routes', 'trip'));
var chatRoutes = require(path.join(__dirname, 'routes', 'chat'));

// Routes : API RESTful
// =============================================================================
app.get('/', (req, res) => {
    console.log('it workkkks')
    res.write('<h1>Wsh les locos !</h1>');
    res.sendStatus(200);
});
app.use('/users', userRoutes);
app.use('/trips', tripRoutes);
app.use('/chat', chatRoutes);



// config files
var db = require('./config/db');
mongoose.connect(db.url,{ useNewUrlParser: true });

// set our port
var port = process.env.PORT || 8080; 

// routes ==================================================
// require('./back/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('RDV au port ' + port);

// expose app           
exports = module.exports = app;                       