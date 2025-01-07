const express = require('express');
const { adminEmployeeLogin, createEmployeeection, getAllEmployees, getAllTaks, getEmployeeTask, createTask, assignTaskEmployee, updateTaskToEmployee } = require('../controllers/employeeControllers');

const router  = express.Router();

router.post('/adminemployee/login', adminEmployeeLogin);
router.post('/admins/createEmployee', createEmployeeection);
router.get('/admins/allemplyees', getAllEmployees);
router.get('/admins/getalltask', getAllTaks);
router.get('/admins/getemployeetask', getEmployeeTask);
router.post('/admins/createtask', createTask);
router.post('/admis/assigntask', assignTaskEmployee);
router.put('/admins/updatetask/:id', updateTaskToEmployee);

module.exports = router;