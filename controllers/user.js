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
            res.status(200).send();
        })


        await Waiting.findOne({email: email}, function(err, waiting){
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!waiting) {
                console.log('User not found on waiting list');
                //res.status(404).send();
            }

            else {
                console.log('%s is on waiting list for trip id %s',waiting.email,waiting.trip);
                waiting_id = waiting._id;

                // For each element in waiting list found

                Trip.findOne({_id : waiting.trip}, function(err, trip){

                        if(err) {
                            console.log(err);
                            return res.status(500).send();
                        }

                        if(!trip) {
                            console.log("Trip not found...")
                            return res.status(404).send();
                        }

                        console.log("Trip %s found", trip.name);
                        trip.users.push(user_id);
                        console.log("User added to trip %s ", trip.name);

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

                    console.log(waiting.trip);
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

            }

        })


    },

  register: function (req, res) {
      console.log(req.body);
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;

      var user = new User();
      user.username = username;
      user.email = email;
      user.password = password;

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
                
    await Trip.find({}).then(async (trips) => {      
        var promises =  trips.map( (trip) => {
            return User.findOne({_id : trip.admin
            }).then((user)=>{
                if(user.username==="pierrotdu78"){
                    console.log(user.username + " ", user._id);

                }
                return user;
            }).catch((err) => res.status(500).send(err))
        })           
        
        Promise.all(promises).then(function(users) {
            users.forEach(function(user){
                /* if(user.username==="pierrotdu78"){
                    console.log(user.username + " ", user._id);

                } */
                //console.log(user.username + " ", user._id);
            })
            res.status(200).send(users);
        })
    }).catch((err) => res.status(500).send(err))
    }
};

module.exports = userController;
