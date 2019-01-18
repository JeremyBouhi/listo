import User from './../models/user'

var userController = {
  login: function (req, res) {
        console.log(req.body);
        var email = req.body.email;
        var password = req.body.password;

        User.findOne({email: email, password: password}, function(err, user) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!user) {
                console.log('User not found');
                return res.status(404).send();
            }
            console.log('Welcome back on Listo %s el loco', user.username);
            req.session.user = user;
            
            // req.session.user.save((err) => {
            //     if (!err) {
            //         console.log(req.session);
            //         // res.redirect("/");
            //     }
            // });

            console.log('req.session.user: ', req.session.user);
            return res.status(200).send();
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

  }

};

module.exports = userController;
