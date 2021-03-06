import Trip from './../models/trip'
import User from './../models/user'
// var curl = require('curl')
var request = require('request-promise')


// Level setup
var level_up = [500,1000,2000,5000,10000,20000,50000];
var level_name = ["Marin d'eau douce", "Moussaillon", "Vigie", "Cannonier", "Timonier", "Capitaine", "Barbe Noir", "Seigneur des Pirates"];

// Mail setup
var nodemailer     = require('nodemailer');
var handlebars     = require('handlebars');
var fs             = require('fs');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

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


var indexOfMin = function(arr) { 
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }
    return minIndex;
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
        }).then(async(trip) => {
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


            // budget badge
            if(counterOfUsersWhoAlreadySetBudget == trip.users.length) {
                var gap_transportation = [];
                var gap_accommodation = [];
                var gap_on_the_spot = [];
                var gap_total = [];
                var gap = [];


                for(var i = 0; i < trip.users.length; i++) {
                    gap_transportation[i] = Math.abs(meanBudgetTransportation - trip.users[i].budget.transportation);
                    gap_accommodation[i] = Math.abs(meanBudgetAccommodation - trip.users[i].budget.accommodation);
                    gap_on_the_spot[i] = Math.abs(meanBudgetOnTheSpot - trip.users[i].budget.on_the_spot);
                    gap_total[i] = Math.abs(meanBudgetTotal - trip.users[i].budget.total);

                    gap[i] = gap_transportation[i] + gap_accommodation[i] + gap_on_the_spot[i] + gap_total[i];

                }
                var index = indexOfMin(gap);
                var user_id = trip.users[index]._id;
                trip.badges.budget = user_id;

                var bonus_points_budget = 250;

                // Update trip.users & ranking with new points won
                trip.users.find(x => x._id == user_id).points += bonus_points_budget;

                var ranking = [];
                for(const item of trip.users){
                    await User.findOne({_id: item._id}, function(err, user) {
                        if(err) {
                            console.log(err);
                        }
                        if(!user) {
                            console.log("User "+ item.userInvolved + " not found...");
                        }
                    }).then((user)=>{
                        ranking.push({username: user.username, avatar: user.avatar, points: item.points});
                        console.log("User " + user.username + " added with " + item.points + " points to the ranking array");
                    });
                }

                trip.ranking = ranking.sort(function (a, b) {
                    return b.points - a.points;
                });
                console.log("Trip ranking updated");


                User.findOne({_id : user_id}, function(err, user) {
                    if(err) {
                        console.log(err);
                        return res.status(500).send();
                    }
                    if(!user) {
                        console.log('User not found');
                        return res.status(404).send();
                    }
                    user.badges.budget += 1;

                    user.progress += bonus_points_budget;

                    // If level up
                    if(user.progress >= level_up[user.avatar-1]){
                        var remainder = user.progress - level_up[user.avatar-1];
                        var level = "level" + user.avatar.toString();
                        user.avatar ++;
                        user.level = level_name[user.avatar-1];
                        user.progress = remainder;
                        user.badges[level] = true;
                        console.log("Trip badge " + level + " : " + user.badges[level]);
                        console.log("Level up ! New level : ",user.level);

                        // Send email to user

                        readHTMLFile('./templates/emailLevelUp.html', function(err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                 username: user.username,
                                 level: user.level
                            };
                            var htmlToSend = template(replacements);
                            var mailOptions = {
                                from: 'noreply.listo@gmail.com',
                                to : user.email,
                                subject : "Tu as gagné une promotion bien méritée " + user.username +' !',
                                html : htmlToSend,
                                attachments: [{
                                    filename: 'logo.png',
                                    path: './images/logo.png',
                                    cid: 'logo' //same cid value as in the html img src
                                }]
                             };

                             transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                  console.log(err)
                                else
                                  console.log('Message sent: ' + info.response);
                             });
                        });
                    }

                    user.save((err, result) => {
                        if(err) {
                            console.log(err);
                            res.status(500).send("There is an error in modifiyng user in database");
                        }
                        else {
                            console.log("User successfully modified");
                            res.status(200).send();
                        }
                    })
                })
            }

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
    // getPricesItemsByDestination : async function(req, res){        
        
    //     var destinations = req.params.destinations.split(',');
    //     console.log('destinations: ', destinations);
    //     var promises = await destinations.map((destination) => {
    //         console.log('destination: ', destination);
    //         return request.get('http://www.numbeo.com:8008/api/country_prices?api_key='+ process.env.API_KEY_NUMBEO +'&country='+destination, 
    //         res.header('Access-Control-Allow-Origin', req.headers.origin),
    //         function(err, response, body) {
    //             return(body);
    //         })
    //     })
        
    //     Promise.all(promises).then(function(countries) {
            
    //         var tonton = countries.map((country)=>{
    //             country = JSON.parse(country)
    //             country.prices = country.prices.filter(function (el) {
    //                 return el.item_id == 1 || el.item_id == 3 || el.item_id == 4 || el.item_id == 14 || el.item_id == 18
    //                 // ids = domac :3, la pinte:4, bottleOfWine:14, localChesse: 12, repas dans un bon restau : 1, one-way ticket: 18
    //             });
    //             return country;
    //         })
            
    //         console.log('tonton: ', tonton);
    //         res.status(200).send(tonton);
    //     })    
    // },

    getPriceItemByDestination : async function(req, res){        
        var supportedCountries = ["Afghanistan","Aland Islands","Albania","Algeria","Andorra","Angola","Antigua And Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bonaire","Bosnia And Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cayman Islands","Chile","China","Colombia","Congo","Costa Rica","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle Of Man","Israel","Italy","Ivory Coast","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kosovo (Disputed Territory)","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Macao","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Nigeria","Northern Mariana Islands","Norway","Oman","Pakistan","Palestinian Territory","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Kitts And Nevis","Saint Lucia","Saint Vincent And The Grenadines","Samoa","Saudi Arabia","Senegal","Serbia","Seychelles","Singapore","Sint Maarten","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad And Tobago","Tunisia","Turkey","Turkmenistan","Turks And Caicos Islands","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Us Virgin Islands","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]
        if(supportedCountries.includes(req.params.destination)){
        
        var promise = new Promise(function(resolve, reject) {
            return request.get('http://www.numbeo.com:8008/api/country_prices?api_key='+ process.env.API_KEY_NUMBEO +'&country='+req.params.destination, 
            res.header('Access-Control-Allow-Origin', req.headers.origin),
            function(err, response, body) {
                if(err){
                    console.log(err);
                    res.status(500);
                }
                console.log('body: ', body);
                body = JSON.parse(body)
                body.prices = body.prices.filter(function (el) {
                    return el.item_id == 1 || el.item_id == 3 || el.item_id == 4 || el.item_id == 14 || el.item_id == 18
                    // ids = domac :3, la pinte:4, bottleOfWine:14, localChesse: 12, repas dans un bon restau : 1, one-way ticket: 18
                })
                resolve(body);
                
            })
        })
        
        promise.then((result)=> {
            console.log('result: ', result);
            res.status(200).send(result);
        }).catch((err)=> {
            console.log('err: ', err);
            res.status(500);
        })            
        
    }
    else{
        res.status(500)
        res.send('not a country')
        console.log('not a country');
    }   
}

}

module.exports = budgetController;
