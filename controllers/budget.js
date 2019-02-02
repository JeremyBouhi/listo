import Trip from './../models/trip'
import User from './../models/user'
var request = require('request-promise')

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
                var index_user = getIndex(trip.users, '_id', req.session.user._id.toString());
                console.log('index_user: ', index_user);

                if (index_user > -1) {
                    console.log('trip.budget: ', trip.budget);
                    console.log('trip.users[index_user].budget: ', trip.users[index_user].budget);

                    res.status(200).send({
                        meanBudget: trip.budget,
                        myBudget: trip.users[index_user].budget
                    })
                }
                else {
                    // res.status(404)
                    console.log('User not found in this trip');
                }      

    }).catch((err) => {
        res.status(500).send(err)
    })
},

    getPriceItemByDestination : async function(req, res){        
        
        var destinations = req.params.destinations.split(',');
        console.log('destinations: ', destinations);
        var promises = destinations.map( async (destination) => {
            console.log('destination: ', destination);
            return request.get('http://www.numbeo.com:8008/api/country_prices?api_key='+ process.env.API_KEY_NUMBEO +'&country='+destination, function(err, response, body) {
                return(body);
            })
        })
        
        Promise.all(promises).then(function(countries) {
            
            var tonton = countries.map((country)=>{
                country = JSON.parse(country)
                country.prices = country.prices.filter(function (el) {
                    return el.item_id == 1 || el.item_id == 3 || el.item_id == 4 || el.item_id == 14 || el.item_id == 18
                    // ids = domac :3, la pinte:4, bottleOfWine:14, localChesse: 12, repas dans un bon restau : 1, one-way ticket: 18
                });
                return country;
            })
            
            console.log('tonton: ', tonton);
            res.status(200).send(tonton)
        })    
    }
}

module.exports = budgetController;
