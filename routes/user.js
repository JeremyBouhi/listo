var router = require('express').Router();

// Controller
import userController from './../controllers/user';

router.post('/login', userController.login);

module.exports = router;
