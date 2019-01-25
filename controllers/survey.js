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
            
            console.log('trip: ', trip);
            console.log('req.params.typeSurvey: ', req.params.typeSurvey);
        if(req.params.typeSurvey == 'destination')
            trip[req.params.typeSurvey].survey.push({                
                destination_name : req.body.destination_name,
                users_id : req.session.user._id
            })

        else if(req.params.typeSurvey == 'date')
        trip[req.params.typeSurvey].survey.push({                
            custom_id : req.body.id,
            start_date : req.body.start_date,
            end_date : req.body.end_date,
            color: req.body.color,
            users_id : req.session.user._id
        })
        
        trip.save((err, result) => {
            if(err) {
                console.log(err)
                res.status(500).send("There is an error in adding new destination in database");
            }
            
            else res.status(200).send();
            console.log('trip[req.params.typeSurvey].survey: ', trip[req.params.typeSurvey].survey);
        });

        }).catch((err) => {
            console.log('err: ', err);
            res.status(500).send('ça marche despi')})
    },

    addVote : function(req, res){
        // we add the user_id to the array

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
            // first check if the guy didn't vote for it before
            if(!(trip[req.params.typeSurvey].survey.users_id.includes(req.session.user._id)))
                // then we add his vote
                trip[req.params.typeSurvey].survey.users_id.push(req.session.user._id)
            else
            console.log('T as déjà voté gros');

            trip.save((err, result) => {
                if(err) {
                    res.status(500).send("There is an error in adding new destination in database");
                    }
                    
                    else res.status(200).send();
                });
        }).catch((err) => {
            console.log('err: ', err);
            res.status(500).send('ça marche despi')})
    },

    deleteVote : function(req, res){

    },

    deleteData: function(req, res){
        
    }
};

module.exports = surveyController;
