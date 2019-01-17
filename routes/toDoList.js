var router = require('express').Router();

// Controller
import toDoListController from './../controllers/toDoList';

router.post('/add', toDoListController.add);


module.exports = router;