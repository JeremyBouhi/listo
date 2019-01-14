var router = require('express').Router();

// Controller
import tripController from './../controllers/trip';

router.post('/createTrip', tripController.createTrip);

module.exports = router;
