import Trip from './../models/trip'

var toDoListController = {
    add: function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            var typeList = req.params.typeList
            trip[typeList].description

            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }

            trip.toDoList.ListElement.desciption = "ramenener les chips";
            //req.session.user = user;
            console.log('description: ', trip.name);


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

module.exports = toDoListController;
