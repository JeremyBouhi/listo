import Trip from './../models/trip'


var datesController = {

    addDates : function(req, res) {

        year = req.params.year;
        month = req.params.month;
        day = req.params.day;

        const newDates = {
            year,
            month,
            day
        }
        
        console.log('newDates: ', newDates);
        
        Trip.findOne({_id : req.params.tripId
            }).then((trip) => {

        trip.date.dates_survey.push(newDates)

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

module.exports = datesController;
