import Trip from '../models/trip'
import User from '../models/user'
import { callbackify } from 'util';

// Level setup
var level_up = [500,1000,2000,5000,10000,20000,50000];
var level_name = ["Marin d'eau douce", "Moussaillon", "Vigie", "Cannonier", "Timonier", "Capitaine", "Barbe Noir", "Seigneur des Pirates"];

// Mail setup
var nodemailer     = require('nodemailer');
var handlebars     = require('handlebars');
var fs             = require('fs');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};



var listController = {
    add: function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            //insert in correct list the description and difficulty of element
            trip[req.params.typelist].push(req.body);

            if(req.params.typelist == "toDoList"){
                trip.toDoList[trip.toDoList.length-1].points =  (0.75 + (req.body.difficulty * 0.075)) * 300;
            }
            else{
                trip.bringList[trip.bringList.length-1].points =  (0.75 + (req.body.difficulty * 0.075)) * 200;
            }

            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log(err);
                    console.log("There is an error in modifying trip in database");
                    res.status(500).send();
                }
                else res.status(200).send();
            });

        })
    },

    delete : function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
            //delete element of list
           trip[req.params.typelist].remove(req.params.idElement);

           console.log("Element deleted!")

            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    return res.status(500).send();
                }
                else res.status(200).send();
            });

        })
    },

    modify : function (req, res) {
        Trip.findOne({_id : req.params.tripId}, async function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            trip[req.params.typelist].map((element)=>{
                if(element._id==req.params.idElement){
                    element.description=req.body.description;
                    element.difficulty=req.body.difficulty;
                    if(req.params.typelist == "toDoList" ) {
                        element.points = (0.75 + (req.body.difficulty * 0.075)) * 300;
                    }
                    else {
                        element.points = (0.75 + (req.body.difficulty * 0.075)) * 200;
                    }
                    console.log("Body Status : ",req.body.status);
                    console.log("Element status",element.status);

                    // Points given to the user who did the task
                    if(element.status == false && req.body.status == true){
                        User.findOne({_id: element.userInvolved}, function(err, user) {
                            if(err) {
                                console.log(err);
                                return res.status(500).send();
                            }
                            if(!user) {
                                console.log("Trip not found...")
                                return res.status(404).send();
                            }
                            user.progress += element.points;
                            console.log("Progress : ",user.progress);
                            if(user.progress >= level_up[user.avatar-1]){
                                var remainder = user.progress - level_up[user.avatar-1];
                                var level = "level" + user.avatar.toString();
                                user.avatar ++;
                                user.level = level_name[user.avatar-1];
                                user.progress = remainder;
                                user.badges[level] = true;
                                console.log("Trip badge " + level + " : " + user.badges[level]);
                                console.log("Level up ! New level : ",user.level);


                                // Send email to user

                                readHTMLFile('./templates/emailLevelUp.html', function(err, html) {
                                    var template = handlebars.compile(html);
                                    var replacements = {
                                         username: user.username,
                                         level: user.level
                                    };
                                    var htmlToSend = template(replacements);
                                    var mailOptions = {
                                        from: 'noreply.listo@gmail.com',
                                        to : user.email,
                                        subject : "Tu as gagné une promotion bien méritée " + user.username +' !',
                                        html : htmlToSend,
                                        attachments: [{
                                            filename: 'logo.png',
                                            path: './images/logo.png',
                                            cid: 'logo' //same cid value as in the html img src
                                        }]
                                     };

                                     transporter.sendMail(mailOptions, function (err, info) {
                                        if(err)
                                          console.log(err)
                                        else
                                          console.log('Message sent: ' + info.response);
                                     });
                                });
                            }

                            user.save(function (err, updatedUser) {
                                if(err) {
                                    console.log("err : "+ err);
                                    res.status(500).send();
                                }
                                else {
                                    console.log("User modified in database");
                                    res.status(200).send();
                                }
                            })
                        })
                        trip.users.find(x => x._id == element.userInvolved).points += element.points;
                    }
                    element.status=req.body.status;
                    element.userInvolved=req.body.userInvolved;


                }
            });

            var ranking = [];
            for(const item of trip.users){
                await User.findOne({_id: item._id}, function(err, user) {
                    if(err) {
                        console.log(err);
                    }
                    if(!user) {
                        console.log("User "+ item.userInvolved + " not found...");
                    }
                }).then((user)=>{
                    ranking.push({username: user.username, avatar: user.avatar, points: item.points});
                    console.log("User " + user.username + " added with " + item.points + " points to the ranking array");
                });
            }

            trip.ranking = ranking.sort(function (a, b) {
                return b.points - a.points;
            });
            console.log("Trip Ranking : ",trip.ranking);

            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    console.log("err : "+ err);
                    res.status(500).send();
                }
                else {
                    console.log("Element of list modified in database");
                    res.status(200).send();
                }
            });
        })
    },


    get : function (req, res) {

        Trip.findOne({_id : req.params.tripId}, async function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
            for(const item of trip[req.params.typelist]){
                await User.findOne({_id:item.userInvolved}, function(err, user) {
                    if(err) {
                        console.log(err);
                    }

                    if(!user) {
                        console.log("User "+ item.userInvolved + " not found...");
                    }

                }).then((user)=>{
                    item.userInvolved = user.username;
                    console.log("Element in toDo list : ",item.userInvolved);
                });
            }

            console.log("Sending list..")
            res.status(200).send(trip[req.params.typelist]);
        })
    }
};

module.exports = listController;
