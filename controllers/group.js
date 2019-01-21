import Trip from './../models/trip'
import User from './../models/user'
import Waiting from './../models/waiting'

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
                            console.log('err: ', err);
                            console.log("There is an error in adding a waiting element in database");
                            return res.status(500).send();
                        }
                        else {
                            console.log("%s added to the waiting list",waiting.email);
                            res.status(200).send();
                        }
                    })
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
                                console.log('err: ', err);
                                console.log("There is an error in adding a waiting element in database");
                                res.status(500).send();
                            }
                            else {
                                console.log("%s added to the waiting list",user.username);
                                res.status(200).send();
                            }
                        })
                    }
                }
            })
        }
    },addUser : async function(req, res) {

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
                                console.log('err: ', err);
                                console.log("There is an error in adding a waiting element in database");
                                return res.status(500).send();
                            }
                            else {
                                console.log("%s added to the waiting list",waiting.email);
                                res.status(200).send();
                            }
                        })
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
                                    console.log('err: ', err);
                                    console.log("There is an error in adding a waiting element in database");
                                    res.status(500).send();
                                }
                                else {
                                    console.log("%s added to the waiting list",user.username);
                                    res.status(200).send();
                                }
                            })
                        }
                    }
                })
            }
        }
    }

module.exports = groupController;
