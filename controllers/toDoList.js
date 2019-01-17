import List from './../models/list'
import ListElement from './../models/list'


var toDoListController = {
    add: function (req, res) {
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
    }

};

module.exports = toDoListController;
