import Trip from './../models/trip'
import User from './../models/user'


var budgetController = {

    saveBudget: function(req,res) {
        
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }

        var counterOfUsersWhoAlreadySetBudget = 0;
        var meanBudgetTransportation = 0;
        var meanBudgetAccommodation = 0;
        var meanBudgetOnTheSpot = 0;
        var meanBudgetTotal = 0;

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
            //to update budget to the current user
            trip.users.map((user) => {
                if(user._id == req.session.user._id.toString()){

                    user.budget.transportation = req.body.transportation
                    user.budget.accommodation = req.body.accommodation
                    user.budget.on_the_spot = req.body.on_the_spot
                    user.budget.total = req.body.total
                }
            })
            //to calculate the mean budget of the whole group
            trip.users.map((user) => {
                //without taking them who didn't set their budget yet
                if(user.budget.transportation!=0 && user.budget.transportation!=0 && user.budget.transportation!=0) {
                    meanBudgetTransportation += user.budget.transportation;
                    meanBudgetAccommodation += user.budget.accommodation;
                    meanBudgetOnTheSpot += user.budget.on_the_spot;
                    meanBudgetTotal += user.budget.total;
                    counterOfUsersWhoAlreadySetBudget ++;
                }
            })

            meanBudgetTransportation /= counterOfUsersWhoAlreadySetBudget;
            meanBudgetAccommodation /= counterOfUsersWhoAlreadySetBudget;
            meanBudgetOnTheSpot /= counterOfUsersWhoAlreadySetBudget;
            meanBudgetTotal /= counterOfUsersWhoAlreadySetBudget;

            //updating in DB
            trip.budget.transportation = meanBudgetTransportation;
            trip.budget.accommodation = meanBudgetAccommodation;
            trip.budget.on_the_spot = meanBudgetOnTheSpot;
            trip.budget.total = meanBudgetTotal;
            
            trip.save((err, result) => {
                if(err) {
                    console.log('err: ', err);
                    res.status(500).send();
                }
                else {
                    console.log("Budget saved");
                    console.log('New Mean Budget: ', trip.budget);
                res.status(200).send();
            }
        })
    })
},

    getBudget: function(req,res) {
            
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }
        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
            var promise =  trip.users.map((user) => {
                    if(user._id == req.session.user._id.toString()){
                        return {
                            meanBudget: trip.budget,
                            myBudget: user.budget
                        }
                    }                    
            })         
            
            Promise.all(promise).then(function(result) {
                console.log('result: ', result);
                res.status(200).send(result[0])
            })
    }).catch((err) => {
        res.status(500).send(err)
    })
}
    
};

module.exports = budgetController;
