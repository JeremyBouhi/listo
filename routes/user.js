var router = require('express').Router();

// Controller
import userController from './../controllers/user';

router.post('/login', userController.login);
router.post('/register', userController.register);



module.exports = router;
