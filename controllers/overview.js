import User from './../models/user'
import Trip from './../models/trip'

var overviewController = {

    getAllTrips : async function(req, res) {
        if(!req.session.user) {
            console.log('You are not logged')
            return res.status(401).send();
        }
                
        await User.findOne({_id : req.session.user._id
        }).then(async (user) => {
            
            var promises =  user.trips.map((tripId) => {
                return Trip.findOne({_id : tripId
                }).then((trip)=>{
                    return trip;
                }).catch((err) => res.status(500).send(err))
            })           
            
            Promise.all(promises).then(function(trips) {
                console.log(trips)
                res.status(200).send(trips)
            })
        }).catch((err) => res.status(500).send(err))
    }
}

module.exports = overviewController;