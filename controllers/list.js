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
    },

    delete : function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
            //delete element of list
            trip[req.params.typelist].remove(req.params.idElement);
            console.log("message deleted!")

            trip.save(function (err, updatedTrip) {
                if(err) {
                    console.log("There is an error in modifying trip in database");
                    res.status(500).send();
                }
                else res.status(200).send();
            });

        })
    },

    modify : function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }    

            trip[req.params.typelist].map((element)=>{
                if(element._id==req.params.idElement){
                    element.description=req.body.description;
                    element.difficulty=req.body.difficulty;
                    trip.save(function (err, updatedTrip) {
                        if(err) {
                            console.log("There is an error in modifying trip in database");
                            res.status(500).send();
                        }
                        else res.status(200).send();
                    });
                    console.log("Element of list modified in database");
                }
            });
        })
    },
    get : function (req, res) {
        Trip.findOne({_id : req.params.tripId}, function(err, trip) {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            if(!trip) {
                console.log("Trip not found...")
                return res.status(404).send();
            }
            console.log("Sending list..")
            res.status(200).send(trip[req.params.typelist]);

        })
    }
};

module.exports = listController;
