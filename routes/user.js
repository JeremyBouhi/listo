var router = require('express').Router();

// Controller
import userController from './../controllers/user';

router.post('/login', userController.login);
router.put('/editUser', userController.editUser);
<<<<<<< Updated upstream
router.get('/getUserInfo', userController.getUserInfo);
=======
>>>>>>> Stashed changes
router.post('/register', userController.register);



module.exports = router;
