import Message from '../models/message'


var messageController = {

    sendMessage : function(req, res) {
        
        console.log("Working good");
        
         var message=new Message({
            trip_id : "123",
            content : "RATPI Merci pour le point sur MPG",
            sender : "PSG",
            topic : "Destination",
            date : new Date()
         });
        //insertMsgInDB(dbchat,"123","RATPI Merci pour le point sur MPG","PSG","Destination"); 
        message.save((err, result) => {
            if(err) {
                console.log("There is an error in adding message in database");
                res.sendStatus(500);
            }
            else res.sendStatus(200);
        }) 
    }

};

/* function insertMsgInDB(collection,trip_id,content,sender,topic){
    var datetime = new Date();//Retrieve time but with 1 hour less
    datetime.setTime(datetime.getTime() - new Date().getTimezoneOffset()*60*1000);//Set the correct time
    collection.insertOne(
        {
            trip_id : trip_id,
            content : content,
            sender : sender,
            topic : topic,
            date : datetime
        });
}

function retrieveChat(collection,trip_id,subject){
    collection.find({topic:subject, trip_id:trip_id}).toArray(function(err, result) {
        if (err) throw err;
        result.forEach(function(value){
            console.log(value);
            }
        );
      });
} */


module.exports = messageController;
