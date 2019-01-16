var router = require('express').Router();

// Controller
import overviewController from '../controllers/overview';

router.get('/', overviewController.getAllTrips);

module.exports = router;