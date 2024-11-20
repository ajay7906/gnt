const express = require('express');
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const router = express.Router();


router.post('/createjob', createJob);
router.get('/getjob', getJobs);
router.get('/getjobbyid/:id', getJobById);
router.put('/updatejob/:id', getJobById);

module.exports = router;