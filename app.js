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
var cors           = require('cors');
var env            = require('dotenv').config();
var ent            = require('ent');

// config files
var db = require('./config/db');
mongoose.connect(db.url,{ useNewUrlParser: true });

var store = new MongoDBStore({
    uri: db.url,
    collection: 'mySessions'
});

// set our port
var port = process.env.PORT || 8080;



// start app ===============================================
// startup our app at http://localhost:8080
import Message from './models/message'
import User from './models/user'
var server = app.listen(port);
var io = require('socket.io').listen(server,{ origins: '*:*'});

var nsp = io.of('/chat');
nsp.on('connection', function(socket,pseudo){
    console.log('someone connected');

    socket.on('nouveau_client', function(tripId,topic) { 
        console.log("new client connected !");
        var room = tripId+"/"+topic;
        socket.join(room);
        socket.broadcast.to(room).emit('nouveau_client');
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message,tripId,topic,iduser) {
        return User.findOne({_id:iduser}, function(err, user) {
                if(err) {
                    console.log(err);
                }
    
                if(!user) {
                    console.log('User not found');
                }
                
            }).then((user)=>{
                var messageReceived = ent.encode(message);
                var room = tripId+"/"+topic;
                socket.join(room);
                var datetime = new Date();//Retrieve time but with 1 hour less
                datetime.setTime(datetime.getTime() - new Date().getTimezoneOffset()*60*1000);//Set the correct time
                var messagedb=new Message({
                    trip_id : tripId,
                    content : messageReceived,
                    sender : iduser,
                    topic : topic,
                    date : datetime
                    });
                socket.broadcast.to(room).emit('message',{sender:user.username,content:messageReceived,date:datetime});
                console.log("message envoyé à tout le monde");
                

                messagedb.save((err, res) => {
                    if(err) {
                        console.log("err : "+err);
                        console.log("There is an error in adding message in database");
                    }
                });
            });
        
        
    });

    socket.on("disconnect",function(data){
        socket.disconnect();
    });
});

app.get('/:tripId/:topic/chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
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
    res.header('Access-Control-Allow-Origin', '*');
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
var dialogflowRoute  = require(path.join(__dirname, 'routes', 'dialogflow'));

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
app.use('/dialogflow', dialogflowRoute);


// shoutout to the user
console.log('RDV au port ' + port);

// expose app
exports = module.exports = app;
