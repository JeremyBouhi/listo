var router = require('express').Router();

// Controller
import userController from '../controllers/user';
import tripController from '../controllers/trip';

router.post("/", function(req, res) {
    if("email" in req.body.queryResult.parameters)
    {
        console.log('dialogflow login');
        req.body.email=req.body.queryResult.parameters.email;
        req.body.password=req.body.queryResult.parameters.password;
        userController.login(req,res);
    }
    if("name_trip" in req.body.queryResult.parameters)
    {
        console.log('dialogflow creation trip');
        req.session.user=req.body.queryResult.outputContexts[0].parameters.param;
        console.log("req session  :"+req.session.user);
        req.body.name = req.body.queryResult.parameters.name_trip;
        tripController.createTrip(req,res);
    }
    
  });


module.exports = router;