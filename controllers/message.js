import Message from '../models/message'
import User from '../models/user'

var ent = require('ent');

var messageController = {

    sendMessage : function(req, res) { 

        var datetime = new Date();//Retrieve time but with 1 hour less
        datetime.setTime(datetime.getTime() - new Date().getTimezoneOffset()*60*1000);//Set the correct time
        var message=new Message({
            trip_id : req.params.tripId,
            content : req.body.content,
            sender : req.session.user._id,
            topic : req.params.topic,
            date : datetime
         });

         message.save((err, result) => {
            if(err) {
                console.log("There is an error in adding message in database");
                res.status(500).send();
            }
            else res.status(200).send();
        }) 
    },

    getChat : function(req, res) {
         Message.find({trip_id : req.params.tripId,topic:req.params.topic}, function(err, messages) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!messages) {
                console.log("Messages not found...")
                return res.status(404).send();
            }
            
            var promises = messages.map((message)=>{
                 return User.findOne({_id:message.sender},function(err,user){
                    if(err) {
                        console.log(err);
                        return res.status(500).send();
                    }
                    
                    if(!user) {
                        console.log("User not found...")
                        return res.status(404).send();
                    }
                }) .then((user)=>{
                    message.sender=user.username;
                    return message;
                })
            });
            Promise.all(promises).then(function(chat) {
                res.status(200).send(chat);
            })
        }) 

    var iofile = require('../app.js');
    var io = iofile.io;
    var nsp = io.of('/chat');
    
    nsp.on('connection', function(socket,pseudo){
    console.log('someone connected');
    console.log(socket.id);

    socket.on('nouveau_client', function(pseudo,tripId,topic) { 
        socket.pseudo = pseudo;
        console.log("new client connected !");
        var room = tripId+"/"+topic;
        socket.join(room);
        socket.broadcast.to(room).emit('nouveau_client', pseudo);
        console.log(pseudo);
    });
  
      // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message,tripId,topic) {
        var messageReceived = ent.encode(message);
        var room = tripId+"/"+topic;
        socket.join(room);
        socket.broadcast.to(room).emit('message',{pseudo:socket.pseudo,message:messageReceived});
        console.log("message envoyé à tout le monde");
        var datetime = new Date();//Retrieve time but with 1 hour less
        datetime.setTime(datetime.getTime() - new Date().getTimezoneOffset()*60*1000);//Set the correct time
        console.log(req.session.user);
        var messagedb=new Message({
            trip_id : req.params.tripId,
            content : messageReceived,
            sender : req.session.user._id,
            topic : req.params.topic,
            date : datetime
            });

        messagedb.save((err, result) => {
            if(err) {
                console.log("err : "+err);
                console.log("There is an error in adding message in database");
                res.status(500).send();
            }
            else res.status(200).send();
            }) 
    });

    socket.on("disconnect",function(data){
        socket.dosconnect();
      });
});
    }

};



module.exports = messageController;
