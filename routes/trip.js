var router = require('express').Router();

// Controller
import tripController from './../controllers/trip';
import destinationController from './../controllers/destination';

router.post('/createTrip', tripController.createTrip);
router.put('/:tripId/editTrip', tripController.editTrip);
router.put('/:tripId/deleteTrip', tripController.deleteTrip);
router.get('/:tripId', tripController.getTripInfo);

router.post('/:tripId/addDestination', destinationController.addDestination);

//router.post('/:tripId/dates', tripController.dates);
//router.post('/:tripId/budget', tripController.budget);
//router.post('/:tripId/todoList', tripController.list);
//router.post('/:tripId/bringList', tripController.list);



module.exports = router;
