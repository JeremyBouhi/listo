import User from './../models/user'
import Trip from './../models/trip'
import Waiting from './../models/waiting'


var userController = {
  login: async function (req, res) {
        console.log(req.body);
        var email = req.body.email;
        var password = req.body.password;
        var user_id;
        var waiting_id;

        await User.findOne({email: email, password: password}, function(err, user) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!user) {
                console.log('User not found');
                return res.status(404).send();
            }
            console.log('Welcome back on Listo %s el loco', user.username);
            user_id = user._id.toString();
            req.session.user = user;

            //dialogflow response
            if("queryResult" in req.body)
            {
                var speech = "Bienvenue sur Listo "+user.username+".Quel nom de trip souhaitez-vous choisir?";
                res.json({
                    "fulfillmentText": speech,
                    "outputContexts": [
                        {
                          "name": "projects/listo-bf93f/agent/sessions/056081c6-e5c2-ccfc-9adf-1eeff00102d5/contexts/session",
                          "lifespanCount": 50,
                          "parameters": {
                            "param": user
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


         Waiting.find({email: email}, function(err, waitings){
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!waitings) {
                console.log('User not found on waiting list');
            }

            else {

                // For each element in waiting list found
                waitings.forEach(function(waiting){

                    console.log('%s is on waiting list for trip id %s',waiting.email,waiting.trip);
                    waiting_id = waiting._id;

                    Trip.findOne({_id : waiting.trip}, async function(err, trip){

                            if(err) {
                                console.log(err);
                                return res.status(500).send();
                            }

                            if(!trip) {
                                console.log("Trip not found...")
                                return res.status(404).send();
                            }


                            trip.users.push(user_id);
                            console.log("User added to trip %s ", trip.name);


                            // Update trip ranking :

                            var ranking = [];
                            for(const item of trip.users){
                                await User.findOne({_id: item._id}, function(err, user) {
                                    if(err) {
                                        console.log(err);
                                    }
                                    if(!user) {
                                        console.log("User not found...");
                                    }
                                }).then((user)=>{
                                    ranking.push({username: user.username, avatar: user.avatar, points: item.points});
                                    console.log("User " + user.username + " added with " + item.points + " points to the ranking array");
                                });
                            }

                            trip.ranking = ranking.sort(function (a, b) {
                                return b.points - a.points;
                            });
                            console.log("Trip ranking updated");

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

                    User.findOne({_id : user_id}, function(err, user){

                        if(err) {
                            console.log(err);
                            return res.status(500).send();
                        }

                        if(!user) {
                            console.log('User not found');
                            return res.status(404).send();
                        }

                        user.trips.push(waiting.trip);
                        console.log("Trip added to %s",user.username);

                        user.save(function (err, result) {
                            if(err) {
                                console.log("There is an error in modifying user in database");
                                res.status(500).send();
                            }
                            else {
                                console.log("User successfully modified to database");
                                res.status(200).send();
                            }
                        });

                    })

                    Waiting.deleteOne({_id : waiting.id}, function(err) {
                        if(err) {
                            console.log(err);
                            return res.status(500).send();
                        }
                        else {
                            console.log("User is deleted from waiting list");
                        }
                    })
                });
            }

        })

    },

    loginDialogflow: async function (req, res) {
        //console.log(req.body);
        var email = req.body.email;

        await User.findOne({email:email}, function(err, user) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!user) {
                console.log('User not found');
                return res.send(JSON.stringify({

                    fulfillmentText:"L'email "+email+" n'a pas été trouvé. Pouvez-vous le répétez s'il vous plait?",
                    outputContexts: [
                        {
                          "name": req.body.session+"/contexts/login",
                          "lifespanCount": 1
                        },
                      ],
                 }));
            }
            console.log('Welcome back on Listo %s el loco', user.username);
            req.session.user = user;

            //dialogflow response
            if("queryResult" in req.body)
            {
                var speech = "Bienvenue sur Listo "+user.username+". Quel nom souhaitez-vous donner à votre voyage?";
                res.json({
                    "fulfillmentText": speech,
                    "outputContexts": [
                        {
                          "name": req.body.session+"/contexts/session",
                          "lifespanCount": 50,
                          "parameters": {
                            "param": user
                          }
                        },
                        {
                            "name": req.body.session+"/contexts/createTrip",
                            "lifespanCount": 1
                        },
                        {
                            "name": req.body.session+"/contexts/login",
                            "lifespanCount": 0
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

  register: function (req, res) {
      console.log(req.body);
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;
      var level = "Marin d'eau douce";
      var avatar = 1;
      var progress = 0;


      // Check if the email is already in database
      User.findOne({email : email}, async function(err, user){
          if(err) {
              console.log(err);
              return res.status(500).send();
          }

          if(!user) {
              var user = new User();
              user.username = username;
              user.email = email;
              user.password = password;
              user.level = level;
              user.progress = progress;
              user.avatar = avatar;

              user.save((err, result) => {
                  if(err) {
                      console.log("There is an error in adding user in database");
                      res.status(500).send();
                  }
                  else {
                      console.log("User added to database");
                      res.status(200).send();
                  }
              })

          }

          else {
              console.log("Email already used");
              res.status(401).send("Email already used");
          }

      })

  },


  editUser: function(req,res){


    User.findOne({email : req.session.user.email}, function(err, user) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!user) {
                console.log("User not found...")
                return res.status(404).send();
            }


            user.username = req.body.username;
            user.email = req.body.email;
            user.password =req.body.password;

            req.session.user=user;//mis à jour de la session
            console.log(req.session.user);

            user.save(function (err, updatedUser) {
                if(err) {
                    console.log("There is an error in modifying user in database");
                    res.status(500).send();
                }
                else res.status(200).send();
            });


        })
  },
  getUserInfo: function(req,res){
      if(!req.session.user){
        console.log("Problem when accessing information of user");
        res.status(401).send();
    }
      else
        res.status(200).send(req.session.user);
  },


  logOut: function(req, res) {
    if(!req.session.user){
        console.log("You're not logged");
        res.status(401).send();
      }
      req.session.destroy();
      console.log("Session destroyed, you are now not logged");
      res.status(200).send()

    },

  deleteUser: async function(req, res) {
    if(!req.session.user){
        console.log("You're not logged");
        return res.status(401).send();
      }

     await Trip.find({admin:req.session.user._id}).then(async (trips) => {
        var promises = trips.map((trip) => {
            trip.users.remove(trip.admin);
            trip.admin="";
            trip.save(function (err, updatedTrip) {
                if(err) {
                console.log("There is an error in modifying trip in database");
                res.status(500).send();
                }
            });
        })

    }).catch((err) => res.status(500).send(err))
    User.deleteOne( {_id:req.session.user._id},function(err){
    if (err) {
        console.log("There is an error in deleting user in database");
        res.status(500).send();
    }
    });
    console.log("User deleted in database");

    //still need to implement if no user in users array of trip, delete trip
     await Trip.find({}).then(async (trips) => {
        var promises = trips.map((trip) => {
             trip.users.map((user)=>{
                if(user._id==req.session.user._id.toString())
                 {
                    trip.users.remove(user._id);
                    trip.save(function (err, updatedTrip) {
                        if(err) {
                        console.log("There is an error in modifying trip in database");
                        res.status(500).send();
                        }
                    });
                 }
             });
        })
        res.status(200).send();
    }).catch((err) => res.status(500).send(err));

    }
};

module.exports = userController;
