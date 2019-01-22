import Trip from './../models/trip'
import User from './../models/user'


var budgetController = {
    
    saveBudget: function(req,res) {
        
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }
        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
            trip.users.map((user) => {
                if(user._id == req.session.user._id.toString()){

                    user.budget.transportation = req.body.transportation
                    user.budget.accommodation = req.body.accommodation
                    user.budget.on_the_spot = req.body.on_the_spot
                    user.budget.total = req.body.total
                }
            })
            
            trip.save((err, result) => {
            if(err) {
                console.log('err: ', err);
                res.status(500).send();
            }
            else {
                console.log("Budget saved");
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

                    return user.budget
                }
            })          
            
            Promise.resolve(promise).then(function(budget) {
                console.log('budget[0]: ', budget[0]);

                // [0] because of CoreMongooseArray...
                res.status(200).send(budget[0])
            })
    })
}
    
};

module.exports = budgetController;
