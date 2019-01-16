import User from './../models/user'

var overviewController = {
    getAllTrips : function(req, res) {
        User.findOne({_id : req.params.userId}, function(err, user) {
            if(err) {
                return res.status(500).send();
            }
            res.status(200).send(user.trips)
            })
    }
}

module.exports = overviewController;