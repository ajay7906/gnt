const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const router = express.Router();


router.post('/createjob', createJob);
router.get('/getjob', getJobs);

module.exports = router;