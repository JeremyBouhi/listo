var router = require('express').Router();

// Controller
import userController from '../controllers/user';
import tripController from '../controllers/trip';
import surveyController from '../controllers/survey';

router.post("/", function(req, res) {
    /* if("email" in req.body.queryResult.parameters)
    {
        console.log('dialogflow login');
        req.body.email=req.body.queryResult.parameters.email;
        req.body.password=req.body.queryResult.parameters.password;
        userController.login(req,res);
    } */
    if("email_login" in req.body.queryResult.parameters)
    {
        console.log('dialogflow auto login');
        var email=req.body.queryResult.parameters.email_login;
        email=email.replace(/ /g,"");
        email=email.replace("arobase","@");
        email=email.replace("point",".");
        email=email.toLowerCase();
        console.log("email : "+email);
        req.body.email=email;
        userController.loginDialogflow(req,res);
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
    //add Destination
    if("name_destination" in req.body.queryResult.parameters)
    {
        console.log('dialogflow add destination');
        req.params.typeSurvey='destination';

        var elementSession=req.body.queryResult.outputContexts.filter(item=>item.name.includes('contexts/session'));
        elementSession=elementSession[0].parameters.param;
        elementSession=JSON.stringify(elementSession);
        elementSession=JSON.parse(elementSession);  
        req.session.user=elementSession;

        var elementTrip=req.body.queryResult.outputContexts.filter(item=>item.name.includes('contexts/trip'));
        elementTrip=elementTrip[0].parameters.param;
        elementTrip=JSON.stringify(elementTrip);
        elementTrip=JSON.parse(elementTrip);  
        console.log("elementTrip",elementTrip);
        req.params.tripId=elementTrip._id;
        console.log("req.params.tripId",req.params.tripId);
        req.body.destination_name=req.body.queryResult.parameters.name_destination;
        console.log("req.body.destination_name",req.body.destination_name); 
        surveyController.addData(req,res);
    }
    if("startDate" in req.body.queryResult.parameters)
    {
        console.log('dialogflow addDate trip');

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        var elementTrip=req.body.queryResult.outputContexts.filter(item=>item.name.includes('contexts/trip'));
        elementTrip=elementTrip[0].parameters.param;
        elementTrip=JSON.stringify(elementTrip);
        elementTrip=JSON.parse(elementTrip);  
        console.log("elementTrip",elementTrip);
        req.params.tripId=elementTrip._id;
        console.log("req.params.tripId",req.params.tripId);
        
        var custom_id=elementTrip._id+ String(Math.floor(Math.random() * 10000000) + 1);
        
        var elementSession=req.body.queryResult.outputContexts.filter(item=>item.name.includes('contexts/session'));
        elementSession=elementSession[0].parameters.param;
        elementSession=JSON.stringify(elementSession);
        elementSession=JSON.parse(elementSession);  
        req.session.user=elementSession;

        req.params.typeSurvey='date';

        req.body.custom_id = custom_id;
        req.body.start_date = req.body.queryResult.parameters.startDate;
        req.body.end_date = req.body.queryResult.parameters.endDate;
        req.body.color = color;
        req.body.user_id = req.session.user._id;
        console.log("req session  _id:"+req.session.user._id);
        surveyController.addData(req,res);
    }
  });

module.exports = router;