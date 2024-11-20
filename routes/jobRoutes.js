const express = require('express');
const { createJob, getJobs, getJobById, deleteJobById } = require('../controllers/jobController');
const router = express.Router();


router.post('/createjob', createJob);
router.get('/getjob', getJobs);
router.get('/getjobbyid/:id', getJobById);
router.put('/updatejob/:id', getJobById);
router.delete('/deletejob/:id', deleteJobById);

module.exports = router;