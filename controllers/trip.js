import Trip from './../models/trip'


var tripController = {

    createTrip : function(req, res) {
        //if(!req.session.user) {
        //    console.log('You are not logged anymore')
        //    return res.status(401).send();
        //}
        console.log(req.body);
        var name = req.body.name;

        //req.session.user.trip =  name
        var trip = new Trip();
        trip.name = name;

        trip.save((err, result) => {
            if(err) {
                console.log("There is an error in adding trip in database");
                res.sendStatus(500);
            }
            else res.sendStatus(200);
        })

    }

};

module.exports = tripController;
