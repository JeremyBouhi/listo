import Trip from './../models/trip'


var surveyController = {
    
    getData: async function (req, res) {
    if(!req.session.user){
        console.log("Problem when accessing information of user");
        res.status(401).send();
    }
        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {

            res.status(200).send(trip[req.params.typeSurvey].survey);
        })
    },

    addData : function(req, res) { 
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }
        
        Trip.findOne({_id : req.params.tripId
            }).then((trip) => {
        
        if(req.params.typeSurvey == 'destination')
            trip[req.params.typeSurvey].survey.push({                
                destination_name : req.body.destination_name,
                users_id : req.session.user._id
            })

        else if(req.params.typeSurvey == 'dates')
            trip[req.params.typeSurvey].survey.push({                
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
                users_id : req.session.user._id
        })

        trip.save((err, result) => {
            if(err) {
                console.log(err)
                res.status(500).send("There is an error in adding new destination in database");
            }
            else res.status(200).send();
        });

        }).catch((err) => {
            console.log('err: ', err);
            res.status(500).send('ça marche despi')})
    }
};

module.exports = surveyController;
