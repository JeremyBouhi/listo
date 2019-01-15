var router = require('express').Router();

// Controller
import userController from './../controllers/user';

router.get('/login', userController.login);
router.post('/register', userController.register);



module.exports = router;
