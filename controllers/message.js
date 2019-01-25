import Message from '../models/message'
import User from '../models/user'

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
    }

};



module.exports = messageController;
