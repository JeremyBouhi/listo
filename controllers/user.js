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
                    return res.status(404).send();
                }
                console.log('Welcome back on Listo %s el loco', user.username);
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
              res.sendStatus(500);
          }
          else res.sendStatus(200);
      })

  }

};

module.exports = userController;
