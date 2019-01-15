var router = require('express').Router();

// Controller
import messageController from '../controllers/message';

router.post('/userId/tripId/topic', messageController.sendMessage);
//router.post(':userId/:tripId/:topic', chatController.retrieveChat);
//router.post('/register', chatController.register);

module.exports = router;
