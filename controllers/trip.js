import Trip from './../models/trip'
import User from './../models/user'
import Waiting from './../models/waiting'

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


var indexOfMin = function(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }
    return minIndex;
}

var indexOfMax = function(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}



var tripController = {

    createTrip : async function(req, res) {
        if(!req.session.user) {
           console.log('You are not logged')
           return res.status(401).send();
        }
        var name = req.body.name;
        var admin = req.session.user._id;

        var trip = new Trip();
        trip.name = name;
        trip.admin = admin;
        trip.badges.admin = admin;
        trip.users.push(admin.toString());
        trip.ranking.push({username: req.session.user.username, avatar: req.session.user.avatar, points: 0});

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

            user.badges.admin += 1;
            user.trips.push(trip._id.toString());
            req.session.user = user;


            user.save((err, result) => {
                if(err) {
                    console.log('err: ', err);
                    console.log("There is an error in modifying user in database");
                    res.status(500).send();
                }

            })
            if("queryResult" in req.body)
                    {
                        console.log(user);
                        var speech1 = "Le voyage "+name+ " a été créé";
                        var speech2 = "A quel destination souhaitez-vous vous rendre?";
                        res.json({
                            "fulfillmentText": speech1+". "+speech2,
                            "outputContexts": [
                                {
                                  "name": req.body.session+"/contexts/session",
                                  "lifespanCount": 50,
                                  "parameters": {
                                    "param": user
                                  },
                                  "name": req.body.session+"/contexts/trip",
                                  "lifespanCount": 50,
                                  "parameters": {
                                    "param": trip
                                  }
                                }
                              ],
                        });
                    }
                else
                {
                    res.status(200).send();
                }
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

    getTripInfo : function(req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            res.status(200).send(trip);
        })
    },

    isAdmin : function(req, res) {

        if(!req.session.user) {
            console.log('You are not logged')
            return res.status(401);
        }

        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                res.status(500);
            }
            if(trip.admin != req.session.user._id) {
                console.log("You are not the admin of this trip");
                res.status(200).send(false);
            }
            else {
                console.log("You are the admin of this trip");
                res.status(200).send(true);
            }


        })
    },

    getFinalDestination: function(req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                res.status(500);
            }
            res.status(200).send(trip.destination.final_destination)
        })
    },

    
    updateState: function(req, res) {
        // state prend en compte si :
            // date validée
            // destination validée
            // les todo sont done

        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
            }
            var state = 0;

            if(trip.destination.validated){
                state += 32;
            }
            if(trip.date.validated){
                state += 32;
            }
                
            console.log('trip.toDoList.length: ', trip.toDoList.length);
                
            if(trip.toDoList.length>1) {
                trip.toDoList.map((element) => {
                    if(element.status)
                        state += 36/trip.toDoList.length;
                })
            }
            
            trip.state = state
            console.log('state: ', state);

            trip.save((err, result) => {
                if(err) {
                    res.status(200);
                    console.log(err);
                }
            });
    
            }).catch((err) => {
                res.status(500);
                console.log(err);})
        },

    endTrip: function(req,res) {

        Trip.findOne({_id : req.params.tripId}, async function(err,trip) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            var points = [];

            for(var i = 0; i < trip.users.length; i++) {
                points[i] = trip.users[i].points;
            }

            var index_winner = indexOfMax(points);
            var index_loser = indexOfMin(points);
            var user_id_winner = trip.users[index_winner]._id;
            var user_id_loser = trip.users[index_loser]._id;
            var username_winner;
            var username_loser;
            var bonus_points_winner = 500;

            trip.badges.winner = user_id_winner;
            trip.badges.loser = user_id_loser;

            await User.findOne({_id : user_id_winner}, function(err, user) {
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }
                if(!user) {
                    console.log('User not found');
                    return res.status(404).send();
                }
                username_winner = user.username;
                user.badges.winner += 1;
                console.log("Old progress : ",user.progress);
                user.progress += bonus_points_winner;
                console.log("New progress : ",user.progress);

                // If level up
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

                user.save((err, result) => {
                    if(err) {
                        console.log(err);
                        res.status(500).send("There is an error in modifiyng user in database");
                    }
                    else {
                        console.log("User successfully modified");
                        res.status(200);
                    }
                })
            })

            await User.findOne({_id : user_id_loser}, function(err, user) {
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }
                if(!user) {
                    console.log('User not found');
                    return res.status(404).send();
                }
                username_loser = user.username;
                user.badges.loser += 1;
                user.save((err, result) => {
                    if(err) {
                        console.log(err);
                        res.status(500).send("There is an error in modifiyng user in database");
                    }
                    else {
                        console.log("User successfully modified");
                        res.status(200);
                    }
                })
            })
            var username_destination = "undefined";
            var username_date = "undefined";
            var username_budget = "undefined";
            var username_admin = "undefined";

            // Destination
            // var username_destination = getUserName(trip.badges.destination);
            await User.findOne({_id: trip.badges.destination}, function(err, user) {
                if(user){
                username_destination = user.username;
                }
            })

            // Date
            // var username_date = getUserName(trip.badges.date);
            await User.findOne({_id: trip.badges.date}, function(err, user) {
                if(user){
                username_date = user.username;
                }
            })

            // Budget
            // var username_budget = getUserName(trip.badges.budget);
            await User.findOne({_id: trip.badges.budget}, function(err, user) {
                if(user){
                username_budget = user.username;
                }
            })

            // Admin
            // var username_admin = getUserName(trip.badges.admin);
            await User.findOne({_id: trip.badges.admin}, function(err, user) {
                if(user){
                username_admin = user.username;
                }
            })

            var username;
            var email;

            // Send email recap when the trip starts for all the users
            for(var i = 0; i < trip.users.length; i++) {


                await User.findOne({_id: trip.users[i]._id}, function(err, user) {
                    username = user.username;
                    email = user.email;
                })

                await readHTMLFile('./templates/emailEnd.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                         username_winner: username_winner,
                         username_loser: username_loser,
                         username_destination: username_destination,
                         username_date: username_date,
                         username_budget: username_budget,
                         username_admin: username_admin,
                         trip_name: trip.name,
                         trip_start: trip.date.final_start_date,
                         trip_end: trip.date.final_end_date,
                         trip_destination: trip.destination.final_destination,
                         number : trip.users.length
                    };
                    var htmlToSend = template(replacements);
                    var mailOptions = {
                        from: 'noreply.listo@gmail.com',
                        to : email,
                        subject : "L'heure du départ à l'aventure a sonné " + username +' !',
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

            trip.save((err, result) => {
                if(err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                else {
                    console.log("Trip successfully modified");
                    res.status(200).send();
                }
            })

        })

    }
}

module.exports = tripController;
