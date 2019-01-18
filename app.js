// modules =================================================
var express        = require('express');
var path           = require('path');
var app            = express();
var session        = require('express-session');
var MongoDBStore   = require('connect-mongodb-session')(session);
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var cors           = require('cors')
var env            = require('dotenv').config()

// config files
var db = require('./config/db');
mongoose.connect(db.url,{ useNewUrlParser: true });

var store = new MongoDBStore({
    uri: db.url,
    collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors({
    origin:['http://localhost:4200'],
    credentials: true // enable set cookie
}));

// app.set('trust proxy', 1)

app.use(session({
    key: 'user_sid',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    maxAge: 1000 * 60 * 60 * 24,
    // proxy: true,
    cookie: {
        expires: 600000
        },
    store: store
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
     } else {
        next();
     }
    });

// Routes ===========================================
var userRoutes      = require(path.join(__dirname, 'routes', 'user'));
var tripRoutes      = require(path.join(__dirname, 'routes', 'trip'));
// var messageRoutes   = require(path.join(__dirname, 'routes', 'message'));
var overviewRoutes  = require(path.join(__dirname, 'routes', 'overview'));

// Routes : API RESTful
// =============================================================================
app.get('/', (req, res) => {
    console.log('it workkkks')
    res.status(200).send();
});
app.use('/users', userRoutes);
app.use('/trips', tripRoutes);
// app.use('/message', messageRoutes);
app.use('/overview', overviewRoutes);


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
