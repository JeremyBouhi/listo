import Trip from './../models/trip'
import User from './../models/user'
import Waiting from './../models/waiting'

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

        req.session.user.trips.push(trip._id.toString());

        trip.save((err, result) => {
            if(err) {
                console.log("There is an error in adding trip in database");
                res.status(500).send();
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


    addUser : function(req, res) {

        console.log(req.body);

        var email = req.body.email;
        var user_id;
        var trip_id = req.params.tripId;
        var isInDatabase = false;


        // Check if the user we want to add in the trip is in the database
        User.findOne({email : email}, function(err, user){
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!user) {
                console.log("User not found...")
            }

            else {
            console.log("User found %s with id %s ",user.username,user._id);
            id = user._id;
            isInDatabase = true;
            //res.status(200).send();
            }
        });


        if (isInDatabase == false){


            waiting = new Waiting();
            waiting.email = email;
            waiting.trip = trip_id;


        }





        Trip.findOne({_id : trip_id}, function(err, trip) {

            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            console.log("Trip %s found", trip.name);
            console.log("User id : ",id);
            trip.users.push(id.toString());

            console.log("User %s added to trip %s ", id, trip.name);

            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    res.status(500).send();
                }
                else {
                    console.log("Trip saved to database");
                    res.status(200).send();
                }
            });

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
    }


};

module.exports = tripController;
