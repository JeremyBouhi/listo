var router = require('express').Router();

// Controller
import tripController from './../controllers/trip';
import destinationController from './../controllers/destination';
import messageController from '../controllers/message';
import toDoListController from './../controllers/toDoList';

router.post('/createTrip', tripController.createTrip);
router.put('/:tripId/editTrip', tripController.editTrip);
router.put('/:tripId/deleteTrip', tripController.deleteTrip);
router.put('/:tripId/addUser', tripController.addUser);
router.get('/:tripId', tripController.getTripInfo);

router.post('/:tripId/chat/:topic', messageController.sendMessage);
router.post('/:tripId/chat/:topic', messageController.retrieveChat);

router.post('/:tripId/addDestination', destinationController.addDestination);
router.put('/:tripId/add', toDoListController.add);
//router.post('/:tripId/dates', tripController.dates);
//router.post('/:tripId/budget', tripController.budget);
//router.post('/:tripId/todoList', tripController.list);
//router.post('/:tripId/bringList', tripController.list);



module.exports = router;
