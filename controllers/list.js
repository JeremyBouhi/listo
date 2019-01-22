import Trip from '../models/trip'

var listController = {
    add: function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
            //insert in correct list the description and difficulty of element
            trip[req.params.typelist].push(req.body);

            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    res.status(500).send();
                }
                else res.status(200).send();
            });

        })
    }

};

module.exports = listController;
