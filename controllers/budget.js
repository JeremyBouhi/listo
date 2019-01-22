import Trip from './../models/trip'
import User from './../models/user'


var budgetController = {
    
    saveBudget: function(req,res) {

        req.body.transportation
		req.body.accommodation
		req.body.on_the_spot
		req.body.total
    }
    
};

module.exports = budgetController;
