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
            // else res.sendStatus(200);
        })

    },

    editTrip : function(req, res) {
        //if(!req.session.user) {
        //    console.log('You are not logged anymore')
        //    return res.status(401).send();
        //}

        var newName = req.body.name;
        //var oldName = req.params.tripId;

        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            var oldName = trip.name;
            console.log("Original name : %s", oldName);
            console.log("New name : %s", newName);
            trip.name = newName;
            //req.session.user = user;
            console.log('Name is changed ! it is now %s', trip.name);


            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    res.sendStatus(500);
                }
                else res.sendStatus(200);
            });

        })
        
    },
    getTripInfo : function(req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            res.status(200).send(trip);
        })
    }


};

module.exports = tripController;
