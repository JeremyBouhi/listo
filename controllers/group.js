import Trip from './../models/trip'
import User from './../models/user'
import Waiting from './../models/waiting'


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

//const mailOptions = {};

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


// Remove Object from array by attribut
var getIndex = function(arr, attr, value){
    var i = arr.length;
    var index = -1;
    while(i--){
       if( arr[i][attr] == value){
           index = i;
           break;
       }
    }
    return index;
}




var groupController = {

    getGroup: async function(req, res){
        if(!req.session.user) {
            console.log('You are not logged')
            return res.status(401).send();
        }

        await Trip.findOne({_id : req.params.tripId
        }).then(async (trip) => {

            var promises =  trip.users.map((userId) => {
                return User.findOne({_id : userId
                }).then((user)=>{
                    return user;
                }).catch((err) => res.status(500).send(err))
            })

            Promise.all(promises).then(function(users) {
                console.log(users)
                res.status(200).send(users)
            })
        }).catch((err) => res.status(500).send(err))
    },

    addUser : async function(req, res) {

        if(!req.session.user) {
           console.log('You are not logged')
           return res.status(401).send();
        }

        var email = req.body.email;
        var trip_id = req.params.tripId;
        var isInTrip = false;
        var exist = false;

        var waiting = new Waiting();
        waiting.email = email;
        waiting.trip = trip_id;
        waiting.isInDatabase = false;

        // Check if user is already in waiting list for this trip
        await Waiting.findOne({email : waiting.email, trip : waiting.trip }, function (err, waiting){

            if(err) {
                console.log("Error when using find one");
                return res.status(500).send();
            }

            if(waiting) {
                console.log("User already added to the waiting list for this trip !")
                exist = true;
                res.status(401).send();
            }

        })

        if(!exist){

            // Check if the user we want to add in the trip is in the database
            User.findOne({email : email}, async function(err, user){
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }

                if(!user) {
                    console.log("User not registered yet")
                    waiting.save((err, result) => {
                        if(err) {
                            console.log("There is an error in adding a waiting element in database");
                            return res.status(500).send();
                        }
                        else {
                            console.log("%s added to the waiting list",waiting.email);
                            res.status(200).send();
                        }
                    })

                    readHTMLFile('./templates/emailNotInDb.html', function(err, html) {
                        var template = handlebars.compile(html);
                        var replacements = {
                             username: req.session.user.username
                        };
                        var htmlToSend = template(replacements);
                        var mailOptions = {
                            from: 'noreply.listo@gmail.com',
                            to : email,
                            subject : 'Organise ton voyage avec '+ req.session.user.username +' sur Listo !',
                            html : htmlToSend
                         };

                         transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                              console.log(err)
                            else
                              console.log('Message sent: ' + info.response);
                         });
                    });


                }

                else {
                    console.log("User found %s with id %s ",user.username,user._id);

                    // Check if the user is already in the trip
                    await Trip.findOne({_id : trip_id}, function(err, trip){

                        if(err) {
                            console.log("Error when using find one");
                            return res.status(500).send();
                        }

                        if(!trip) {
                            console.log("Trip %s not found", trip_id);
                            return res.status(404).send();
                        }

                        if(trip.users.indexOf(user._id.toString()) > -1 ) {
                            isInTrip = true;
                            console.log("%s already added to the %s trip",user.username,trip.name);
                        }
                    })

                    if(isInTrip == true){
                        return res.status(401).send();
                    }

                    else {
                        waiting.user_id = user._id;
                        waiting.isInDatabase = true;

                        waiting.save((err, result) => {
                            if(err) {
                                console.log("There is an error in adding a waiting element in database");
                                res.status(500).send();
                            }
                            else {
                                console.log("%s added to the waiting list",user.username);
                                res.status(200).send();
                            }
                        })

                        readHTMLFile('./templates/emailInDb.html', function(err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                 username1: req.session.user.username,
                                 username2: user.username
                            };
                            var htmlToSend = template(replacements);
                            var mailOptions = {
                                from: 'noreply.listo@gmail.com',
                                to : email,
                                subject : req.session.user.username +' invite le célèbre ' + user.username + ' pour la prochaine quête !',
                                html : htmlToSend
                             };

                             transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                  console.log(err)
                                else
                                  console.log('Message sent: ' + info.response);
                             });
                        });
                    }
                }
            })
        }
    },

        removeUser : async function(req, res) {

            if(!req.session.user) {
               console.log('You are not logged')
               return res.status(401).send();
            }

            var user_id;
            var email = req.body.email;

            // Get the id of the user we want to remove
            await User.findOne({email : email}, function(err, user ) {
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }
                if(!user) {
                    console.log("User %s not found...",email);
                    return res.status(404).send();
                }
                else {
                    console.log("User %s found",user.username);
                    user_id = user._id.toString();
                }
            });

            // Remove user from the trip
            Trip.findOne({_id : req.params.tripId}, function(err, trip) {
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }
                if(!trip) {
                    console.log("Trip not found...");
                    return res.status(404).send();
                }
                // You have to be the admin of the trip in order to remove a user
                if(trip.admin != req.session.user._id) {
                    console.log("You are not the admin of this trip");
                    return res.status(401).send();
                }
                else {
                    console.log("Trip %s found", trip.name);
                    var index_trip = getIndex(trip.users, '_id', user_id);

                    if (index_trip > -1) {
                        trip.users.splice(index_trip, 1);
                        trip.save((err, result) => {
                            if(err) {
                                console.log("There is an error in modifying trip in database");
                                res.status(500).send();
                            }
                            else {
                                console.log("Trip %s modified successfully", trip.name);
                                res.status(200).send();
                            }
                        });

                        // Removing trip from the user removed
                        User.findOne({_id : user_id}, function(err, user ) {
                            if(err) {
                                console.log(err);
                                return res.status(500).send();
                            }
                            if(!user) {
                                console.log("User %s not found...",email);
                                return res.status(404).send();
                            }
                            else {
                                var index_user = user.trips.indexOf(trip._id);
                                if (index_user > -1) {
                                    user.trips.splice(index_user, 1);
                                    user.save((err, result) => {
                                        if(err) {
                                            console.log("There is an error in modifying user in database");
                                            res.status(500).send();
                                        }
                                        else {
                                            console.log("User %s modified successfully", user.username);
                                            res.status(200).send();
                                        }
                                    });
                                };
                            }
                        });
                    }
                    // The user that we want to remove is not in this trip
                    else {
                        console.log("User not in trip");
                        return res.status(404).send();
                    }
                }
            });
        }
    }

module.exports = groupController;
