var router = require('express').Router();

// Controller
import tripController from './../controllers/trip';
import messageController from '../controllers/message';
import listController from './../controllers/list';
import groupController from './../controllers/group';
import surveyController from './../controllers/survey';
import budgetController from './../controllers/budget';

router.post('/createTrip', tripController.createTrip);
router.get('/:tripId/getTripInfo', tripController.getTripInfo);
router.put('/:tripId/editTrip', tripController.editTrip);
router.put('/:tripId/deleteTrip', tripController.deleteTrip);
router.get('/:tripId', tripController.getTripInfo);
router.get('/:tripId/isAdmin', tripController.isAdmin);
router.get('/:tripId/getFinalDestination', tripController.getFinalDestination);
router.put('/:tripId/endTrip', tripController.endTrip);

router.put('/:tripId/addUser', groupController.addUser);
router.get('/:tripId/getGroup', groupController.getGroup);
router.put('/:tripId/removeUser', groupController.removeUser);

router.post('/:tripId/:topic/sendMessage', messageController.sendMessage);
router.get('/:tripId/:topic/getChat', messageController.getChat);

router.post('/:tripId/:typeSurvey/addData', surveyController.addData);
router.put('/:tripId/:typeSurvey/deleteData', surveyController.deleteData);
router.put('/:tripId/:typeSurvey/editData', surveyController.editData);
router.get('/:tripId/:typeSurvey/getData', surveyController.getData);
router.post('/:tripId/:typeSurvey/validateData', surveyController.validateData);
// router.post('/:tripId/:typeSurvey/addVote', surveyController.addVote);
// router.post('/:tripId/:typeSurvey/deleteVote', surveyController.deleteVote);

router.put('/:tripId/saveBudget', budgetController.saveBudget);
router.get('/:tripId/getBudget', budgetController.getBudget);
//router.get('/:tripId/getPriceItemByDestination/:destinations', budgetController.getPriceItemByDestination);

router.get('/:tripId/:typelist/get', listController.get);
router.put('/:tripId/:typelist/add', listController.add);
router.delete('/:tripId/:typelist/:idElement/delete', listController.delete);
router.put('/:tripId/:typelist/:idElement/modify', listController.modify);




//router.post('/:tripId/budget', tripController.budget);


module.exports = router;
