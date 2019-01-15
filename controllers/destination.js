import Trip from './../models/trip'


var destinationController = {

    addDestination : function(req, res) {
        console.log(req.body);
        var name = req.body.destination_name;

        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }

            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
        
        trip.destination.destination_name = name;

        trip.save((err, result) => {
            if(err) {
                console.log("There is an error in adding new destination in database");
                res.sendStatus(500);
            }
            else res.sendStatus(200);
        });
    })
}


};

module.exports = destinationController;
