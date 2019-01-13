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
  }
};

module.exports = userController;