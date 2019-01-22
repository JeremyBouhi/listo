import Trip from './../models/trip'
import User from './../models/user'


var budgetController = {
    
    saveBudget: function(req,res) {
        
        if(!req.session.user){
            console.log("Problem when accessing information of user");
            res.status(401).send();
        }
        console.log('req.body.transportation: ', req.body.transportation);

        Trip.findOne({_id : req.params.tripId
        }).then((trip) => {
            console.log('req.params.tripId: ', req.params.tripId);
            console.log('req.session.user._id: ', req.session.user._id);
            trip.users.map((user) => {
                console.log('user._id: ', user._id);
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
}
    
};

module.exports = budgetController;
