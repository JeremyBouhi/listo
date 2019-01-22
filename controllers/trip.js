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


var tripController = {

    createTrip : function(req, res) {
        console.log('req.session: ', req.session);
        if(!req.session.user) {
           console.log('You are not logged')
           return res.status(401).send();
        }
        console.log('req.body: ', req.body);
        console.log('req.session.user: ', req.session.user);
        var name = req.body.name;
        var admin = req.session.user._id;

        var trip = new Trip();
        trip.name = name;
        trip.admin = admin;
        trip.users.push(admin.toString());

        req.session.user.trips.push(trip._id.toString());

        trip.save((err, result) => {
            if(err) {
                console.log("There is an error in adding trip in database");
                res.status(500).send(err);
            }
            else res.status(200).send();
        })

        User.findOne({email: req.session.user.email, password: req.session.user.password}, function(err, user) {

            if(err) {
                console.log("error when using find one");
                return res.status(500).send();
            }

            if(!user) {
                console.log("User not found")
                return res.status(404).send();
            }

            user.trips = req.session.user.trips;
            console.log("Trips saved in database : ", user.trips);

            user.save((err, result) => {
                if(err) {
                    console.log('err: ', err);
                    console.log("There is an error in modifying user in database");
                    res.status(500).send();
                }
                else res.status(200).send();
            })
        })
    },

    editTrip : function(req, res) {
        if(!req.session.user) {
           console.log('You are not logged')
           return res.status(401).send();
        }

        var newName = req.body.name;

        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            var oldName = trip.name;
            console.log("Original name : %s", oldName);
            console.log("New name : %s", newName);
            trip.name = newName;
            //req.session.user = user;
            console.log('Name is changed ! It is now %s', trip.name);


            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    res.status(500).send();
                }
                else res.status(200).send();
            });

        })

    },


    deleteTrip : function(req, res) {

        if(!req.session.user) {
           console.log('You are not logged')
           return res.status(401).send();
        }

        Trip.findOne({_id : req.params.tripId}, function(err, trip) {

            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            console.log("Trip %s found", trip.name);

            User.findOne({email: req.session.user.email, password: req.session.user.password}, function(err, user) {

                if(err) {
                    console.log("Error when using find one");
                    return res.status(500).send();
                }

                if(!user) {
                    console.log("User not found")
                    return res.status(404).send();
                }


                var index = user.trips.indexOf(trip._id.toString());

                if (index > -1) {
                    user.trips.splice(index, 1);
                    req.session.user = user;

                    user.save((err, result) => {
                        if(err) {
                            console.log("There is an error in modifying user in database");
                            res.status(500).send();
                        }
                        else {
                            console.log("User %s modified successfully", user.username);
                            res.status(200).send();
                        }
                    })
                }

            })

            Trip.deleteOne({_id : req.params.tripId}, function(err) {
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }
                console.log("Trip is deleted");
                return res.status(200).send();
            })

        })

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
                user_id = user._id;
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
                var index_trip = trip.users.indexOf(user_id);

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
    },


    getTripInfo : function(req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            res.status(200).send(trip);
        })
    }


};

module.exports = tripController;
