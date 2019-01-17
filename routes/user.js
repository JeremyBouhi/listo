var router = require('express').Router();

// Controller
import userController from './../controllers/user';

router.post('/login', userController.login);
router.put('/editUser', userController.editUser);
router.get('/getUserInfo', userController.getUserInfo);
router.post('/register', userController.register);
router.post('/logOut', userController.logOut); 



module.exports = router;
