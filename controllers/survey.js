import Trip from './../models/trip'
import User from './../models/user'

import tripController from './trip'


// Remove Object from array by attribut
var getIndex = function(arr, attr, value){
    var i = arr.length;
    var index = -1;
    while(i--){
        if( arr[i][attr] == value){
            index = i;
            break;
        }
    }
    return index;
}

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

        console.log("req.params : "+req.params);

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
            console.log('trip: ', trip);
            console.log('req.params.typeSurvey: ', req.params.typeSurvey);
        if(req.params.typeSurvey == 'destination')
            trip[req.params.typeSurvey].survey.push({
                destination_name : req.body.destination_name,
                user_id : req.session.user._id
            })

        else if(req.params.typeSurvey == 'date')
        trip[req.params.typeSurvey].survey.push({
            custom_id : req.body.custom_id,
            start_date : req.body.start_date,
            end_date : req.body.end_date,
            color: req.body.color,
            user_id : req.session.user._id
        })

        trip.save((err, result) => {
            if(err) {
                console.log(err)
                res.status(500).send("There is an error in adding new destination in database");
            }
            console.log('trip[req.params.typeSurvey].survey: ', trip[req.params.typeSurvey].survey);
        });

        }).catch((err) => {
            console.log('err: ', err);
            res.status(500).send('ça marche despi')})
            if('queryResult' in req.body)
            {
                if("name_destination" in req.body.queryResult.parameters)
                    res.status(200).send(JSON.stringify({"fulfillmentText":"La destination "+req.body.destination_name+" a été ajoutée. Quels sont les dates vous conviendraient?"}));
                else if("startDate" in req.body.queryResult.parameters)
                    res.status(200).send(JSON.stringify({"fulfillmentText":"Les dates ont été ajoutées. Rendez vous sur Listo afin de constituer votre équipage"}));
            }
            
            else
                res.status(200).send();
            },

    // addVote : function(req, res){
    //     // we add the user_id to the array

    //     Trip.findOne({_id : req.params.tripId
    //     }).then((trip) => {
    //         // first check if the guy didn't vote for it before
    //         var element_index = getIndex(trip[req.params.typeSurvey].survey, '_id', req.body.id)
    //         if(!(trip[req.params.typeSurvey].survey[element_index].users_id.includes(req.session.user._id)))
    //             // then we add his vote
    //             trip[req.params.typeSurvey].survey[element_index].users_id.push(req.session.user._id)
    //         else {
    //             res.status(401).send('Already voted');
    //             console.log('T as déjà voté gros');
    //         }

    //         trip.save((err, result) => {
    //             if(err) {
    //                 res.status(500).send("There is an error in adding new destination in database");
    //                 }
    //                 else res.status(200).send();
    //             });
    //     }).catch((err) => {
    //         console.log('err: ', err);
    //         res.status(500).send('ça marche despi')})
    // },

    // deleteVote : function(req, res){
    //     Trip.findOne({_id : req.params.tripId
    //     }).then((trip) => {
    //         // first check if the guy had already vote before
    //         // if(trip[req.params.typeSurvey].survey[0].users_id.includes(req.session.user._id.toString())){
    //             // then we delete his vote
    //             var element_index = getIndex(trip[req.params.typeSurvey].survey, '_id', req.body.id)
    //             var index_user = getIndex(trip[req.params.typeSurvey].survey[element_index].users_id, '_id', req.session.user._id.toString())
    //             trip[req.params.typeSurvey].survey[element_index].users_id.slice(index_user, 1)
    //         // }
    //         // else {
    //             // res.status(401).send('Are you sure vote before?');
    //         // }

    //         trip.save((err, result) => {
    //             if(err) {
    //                 res.status(500).send("There is an error in adding new destination in database");
    //                 }
    //                 else res.status(200).send();
    //             });
    //     }).catch((err) => {
    //         console.log('err: ', err);
    //         res.status(500).send('ça marche despi')})
    // },

    editData : function(req, res){
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {

            if(req.params.typeSurvey == 'date')
            {
            var element_index = getIndex(trip[req.params.typeSurvey].survey, 'custom_id', req.body.custom_id)

            trip[req.params.typeSurvey].survey[element_index].start_date = req.body.start_date
            trip[req.params.typeSurvey].survey[element_index].end_date = req.body.end_date
            trip[req.params.typeSurvey].survey[element_index].color = req.body.color
            }

            trip.save((err, result) => {
                if(err) {
                    console.log('err: ', err);
                    res.status(500).send("There is an error in editing date");
                    }
                    else res.status(200).send();
                });

        }).catch((err) => {
            console.log('err: ', err);
            res.status(500).send('ça marche despi')})
    },

    deleteData: function(req, res){
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {

            if(req.params.typeSurvey == 'destination')
            {
                var element_index = getIndex(trip[req.params.typeSurvey].survey, 'destination_name', req.body.destination_name);
            }

            else if(req.params.typeSurvey == 'date')
            {
                var element_index = getIndex(trip[req.params.typeSurvey].survey, 'custom_id', req.body.custom_id);
            }

            if (element_index > -1)
                {
                    trip[req.params.typeSurvey].survey.splice(element_index, 1);
                    trip.save((err, result) => {
                        if(err) {
                            console.log('err: ', err);
                            res.status(500).send("There is an error in deleting data in db");
                            }
                            else res.status(200).send();
                        });
                }
            else
                {
                    res.status(500).send("Couldn't find data with this element_index")
                }

        }).catch((err) => {
            console.log('err: ', err);
            res.status(500).send('ça marche despi')})
    },

    validateData : function(req, res){
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }

        var user_id = "undefined";
        var i = 0;

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {

            if(req.params.typeSurvey == 'destination')
            {
                trip[req.params.typeSurvey].final_destination = req.body.destination_name

                // get the id of the user who proposed the final destination
                while (user_id == "undefined" || i < 100){
                    if(trip[req.params.typeSurvey].survey[i].destination_name == req.body.destination_name){
                        user_id = trip[req.params.typeSurvey].survey[i].user_id;
                    }
                    i += 1;
                }
                trip.badges.destination = user_id;

                User.findOne({_id : user_id}, function(err, user) {
                    if(err) {
                        console.log(err);
                        return res.status(500).send();
                    }
                    if(!user) {
                        console.log('User not found');
                        return res.status(404).send();
                    }
                    user.badges.destination += 1;
                    user.save((err, result) => {
                        if(err) {
                            console.log("There is an error in modifyng user in database");
                            res.status(500).send("There is an error in modifyng user in database");
                        }
                        else {
                            console.log("User successfully modified");
                            res.status(200).send();
                        }
                    })
                })
            }


            else if(req.params.typeSurvey == 'date')
            {
                if(!req.body.start_date){
                    console.log("req.body.date does not exist");
                }
                if(!trip[req.params.typeSurvey].final_start_date){
                    console.log("trip.final does not exist");
                }

                trip[req.params.typeSurvey].final_start_date = req.body.start_date;
                trip[req.params.typeSurvey].final_end_date = req.body.end_date;

                // get the id of the user who proposed the final date
                while (user_id == "undefined" || i < 100){
                    if(trip[req.params.typeSurvey].survey[i].start_date == req.body.start_date && trip[req.params.typeSurvey].survey[i].end_date == req.body.end_date){
                        user_id = trip[req.params.typeSurvey].survey[i].user_id;
                    }
                    i += 1;
                }
                trip.badges.date = user_id;
                console.log('trip.badges: ', trip.badges);
                User.findOne({_id : user_id}, function(err, user) {
                    if(err) {
                        console.log(err);
                        return res.status(500).send();
                    }
                    if(!user) {
                        console.log('User not found');
                        return res.status(404).send();
                    }
                    user.badges.date += 1;
                    user.save((err, result) => {
                        if(err) {
                            console.log("There is an error in modifyng user in database");
                            res.status(500).send("There is an error in modifyng user in database");
                        }
                        else {
                            console.log("User successfully modified");
                            res.status(200).send();
                        }
                    })
                })
            }
            trip[req.params.typeSurvey].validated = 1;

            console.log('trip: ', trip);
        trip.save((err, result) => {
            if(err) {
                    res.status(500).send(err);
                    }
                else {
                    tripController.updateState(req, res)
                    // res.status(200)
                };
            });
        }).catch((err) => {
            res.status(500).send(err)})
    },

    saveDeadline: function(req, res){

        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401);
        }

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
        
        trip[req.params.typeSurvey].deadline = req.body.deadline

        trip.save((err, result) => {
            if(err) {
                res.status(500).send(err);
            }
            else res.status(200);
        });

        }).catch((err) => {
            res.status(500).send(err)})
    }
};

module.exports = surveyController;
