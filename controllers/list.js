import Trip from '../models/trip'
import User from '../models/user'
import { callbackify } from 'util';

var level_up = [500,1000,2000,5000,10000,20000,50000];
var level_name = ["Marin d'eau douce", "Moussaillon", "Vigie", "Cannonier", "Timonier", "Capitaine", "Barbe Noir", "Seigneur des Pirates"];

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
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
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
                                user.avatar ++;
                                user.level = level_name[user.avatar-1];
                                user.progress = remainder;
                                var level = "level" + avatar.toString();
                                trip.badges[level] = true;
                                //user.badges.level.push(true);
                                console.log("Level up ! New level : ",user.level);
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
                    }
                    element.status=req.body.status;
                    element.userInvolved=req.body.userInvolved;
                    console.log(element);
                }
            });

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
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
            console.log("Sending list..")
            res.status(200).send(trip[req.params.typelist]);
            // renvoyer username au lieu de l'id

        })
    }
};

module.exports = listController;
