import Trip from './../models/trip'


var datesController = {

    addDates : function(req, res) {

        if(!req.session.user) {
            console.log('You are not logged')
            return res.status(401).send();
        }
            
        Trip.findOne({_id : req.params.tripId
            }).then((trip) => {

        trip.date.dates_survey.push({
            start_date : {
                year: req.body.start_year,
                month: req.body.start_month,
                day: req.body.start_day
            },
            end_date : {
                year: req.body.end_year,
                month: req.body.end_month,
                day: req.body.end_day
            },
            user_id : req.session.user._id
        })
        console.log('trip: ', trip);

        trip.save((err, result) => {
            if(err) {
                console.log('err: ', err);
                console.log("There is an error in adding new date in database");
                res.status(500).send();
            }
            else res.status(200).send();
        });

        }).catch((err) => res.status(500).send(err))
    }
};

module.exports = datesController;
