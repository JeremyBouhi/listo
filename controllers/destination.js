import Trip from './../models/trip'


var destinationController = {

    addDestination : function(req, res) {

        const destination_name = req.body.destination_name
        const votes_number = 1;

        const newDestination = {
            destination_name,
            votes_number
        }

        console.log('newDestination: ', newDestination);
        
        Trip.findOne({_id : req.params.tripId
            }).then((trip) => {

        trip.destination.destinations_survey.push(newDestination)

        trip.save((err, result) => {
            if(err) {
                console.log("There is an error in adding new destination in database");
                res.status(500).send();
            }
            else res.status(200).send();
        });

        }).catch((err) => res.status(500).send(err))
    }
};

module.exports = destinationController;
