const express = require('express');
const { adminEmployeeLogin, createEmployeeection, getAllEmployees, getAllTaks, getEmployeeTask, createTask, assignTaskEmployee, updateTaskToEmployee } = require('../controllers/employeeControllers');
const employeerAuth = require('../middleware/employeerAuth')
const router  = express.Router();

router.post('/adminemployee/login',  adminEmployeeLogin);
router.post('/admins/createEmployee',employeerAuth, createEmployeeection);
router.get('/admins/allemplyees',employeerAuth, getAllEmployees);
router.get('/admins/getalltask',employeerAuth, getAllTaks);
router.get('/admins/getemployeetask',employeerAuth, getEmployeeTask);
router.post('/admins/createtask',employeerAuth, createTask);
router.post('/admis/assigntask',employeerAuth, assignTaskEmployee);
router.put('/admins/updatetask/:id',employeerAuth, updateTaskToEmployee);

module.exports = router;