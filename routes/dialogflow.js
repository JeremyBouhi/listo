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
        var element=req.body.queryResult.outputContexts.filter(item=>item.name.includes('contexts/session'));
        element=element[0].parameters.param;
        element=JSON.stringify(element);
        element=JSON.parse(element);
      
        req.session.user=element;
        console.log("req session  _id:"+req.session.user._id);
        req.body.name = req.body.queryResult.parameters.name_trip;
        tripController.createTrip(req,res);
    }
    if("startDate" in req.body.queryResult.parameters)
    {
        console.log('dialogflow editDate trip');
        var element=req.body.queryResult.outputContexts.filter(item=>item.name.includes('contexts/session'));
        element=element[0].parameters.param;
        element=JSON.stringify(element);
        element=JSON.parse(element);
      
        req.session.user=element;
        console.log("req session  _id:"+req.session.user._id);
        req.body.name = req.body.queryResult.parameters.name_trip;
        tripController.createTrip(req,res);
    }
    
  });


module.exports = router;