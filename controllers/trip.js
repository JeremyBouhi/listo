import Trip from './../models/trip'
import User from './../models/user'
import Waiting from './../models/waiting'

var tripController = {

    createTrip : function(req, res) {
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
                else 
                {
                    if("queryResult" in req.body)
                    {
                var speech = "Le voyage "+name+ "a été créé";
                res.json({
                    "fulfillmentText": speech
                        });
                    }
                    else
                    {
                        res.status(200).send();
                    }
                }
                
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
                    console.log(err);
                }
            });
    
            }).catch((err) => {
                console.log(err);})
    }
};

module.exports = tripController;
