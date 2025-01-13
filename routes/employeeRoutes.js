// const express = require('express');
// const { adminEmployeeLogin, createEmployeeection, getAllEmployees, getAllTaks, getEmployeeTask, createTask, assignTaskEmployee, updateTaskToEmployee } = require('../controllers/employeeControllers');
// const employeerAuth = require('../middleware/employeerAuth')
// const router  = express.Router();

// router.post('/adminsemployee/login',  adminEmployeeLogin);
// router.post('/admins/createEmployee',employeerAuth, createEmployeeection);
// router.get('/admins/allemplyees',employeerAuth, getAllEmployees);
// router.get('/admins/getalltask',employeerAuth, getAllTaks);
// router.get('/admins/getemployeetask',employeerAuth, getEmployeeTask);
// router.post('/admins/createtask',employeerAuth, createTask);
// router.post('/admis/assigntask',employeerAuth, assignTaskEmployee);
// router.put('/admins/updatetask/:id',employeerAuth, updateTaskToEmployee);

// module.exports = router;


















const express = require('express');
const { 
    adminEmployeeLogin, 
    createEmployeeection, 
    getAllEmployees, 
    getAllTaks, 
    getEmployeeTask, 
    createTask, 
    assignTaskEmployee, 
    updateTaskToEmployee, 
    employeeLogin,
    submitCompletedTask,
    submitIncompleteTask
} = require('../controllers/employeeControllers');
const employeerAuth = require('../middleware/employeerAuth');
const router = express.Router();

// Ensure all controller functions are properly exported and are functions
router.post('/adminsemployee/login', adminEmployeeLogin);
router.post('/admins/employeelogin', employeeLogin)
router.post('/admins/createEmployee', employeerAuth, createEmployeeection);
router.get('/admins/allemplyees', employeerAuth, getAllEmployees);
router.get('/admins/getalltask', employeerAuth, getAllTaks);
router.get('/admins/getemployeetask', employeerAuth, getEmployeeTask);
router.post('/admins/createtask', employeerAuth, createTask);
router.post('/admins/assigntask', employeerAuth, assignTaskEmployee); // Fixed typo in route path
router.put('/admins/updatetask/:id', employeerAuth, updateTaskToEmployee);
router.post('/admins/completetask',employeerAuth, submitCompletedTask);
router.post('/admins/incomplete',employeerAuth, submitIncompleteTask);
module.exports = router;