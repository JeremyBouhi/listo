var router = require('express').Router();

// Controller
import tripController from './../controllers/trip';

router.post('/createTrip', tripController.createTrip);
router.put('/:tripId/editTrip', tripController.editTrip);
//router.post('/:tripId/destination', tripController.destination);
//router.post('/:tripId/dates', tripController.dates);
//router.post('/:tripId/budget', tripController.budget);
//router.post('/:tripId/todoList', tripController.list);
//router.post('/:tripId/bringList', tripController.list);



module.exports = router;
