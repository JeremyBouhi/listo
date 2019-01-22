// import Trip from './../models/trip'


// var destinationController = {

//     addDestination : function(req, res) {

//         const destination_name = req.body.destination_name
//         const users_id = req.session.user._id

//         const newDestination = {
//             destination_name,
//             users_id
//         }

//         console.log('newDestination: ', newDestination);
        
//         Trip.findOne({_id : req.params.tripId
//             }).then((trip) => {

//         trip.destination.survey.push(newDestination)

//         trip.save((err, result) => {
//             if(err) {
//                 console.log(err)
//                 res.status(500).send("There is an error in adding new destination in database");
//             }
//             else res.status(200).send();
//         });

//         }).catch((err) => {
//             console.log('err: ', err);
//             res.status(500).send('ça marche despi')})
//     }
// };

// module.exports = destinationController;
