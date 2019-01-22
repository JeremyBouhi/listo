var router = require('express').Router();

// Controller
import tripController from './../controllers/trip';
// import destinationController from './../controllers/destination';
// import datesController from './../controllers/dates';
import messageController from '../controllers/message';
import listController from './../controllers/list';
import groupController from './../controllers/group';
import surveyController from './../controllers/survey';
import budgetController from './../controllers/budget';

router.post('/createTrip', tripController.createTrip);
router.put('/:tripId/editTrip', tripController.editTrip);
router.put('/:tripId/deleteTrip', tripController.deleteTrip);
router.get('/:tripId', tripController.getTripInfo);

router.put('/:tripId/addUser', groupController.addUser);
router.get('/:tripId/getGroup', groupController.getGroup);

router.post('/:tripId/chat/:topic', messageController.sendMessage);
router.post('/:tripId/chat/:topic', messageController.retrieveChat);

// router.post('/:tripId/addDestination', destinationController.addDestination);
// router.post('/:tripId/addDates', datesController.addDates);

router.post('/:tripId/:typeSurvey/addData', surveyController.addData);
router.get('/:tripId/:typeSurvey/getData', surveyController.getData);

router.put('/:tripId/saveBudget', budgetController.saveBudget);
router.get('/:tripId/getBudget', budgetController.getBudget);

router.put('/:tripId/:typelist/add', listController.add);

//router.post('/:tripId/budget', tripController.budget);
//router.post('/:tripId/todoList', tripController.list);
//router.post('/:tripId/bringList', tripController.list);



module.exports = router;
