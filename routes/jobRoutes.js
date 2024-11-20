const express = require('express');
const { createJob } = require('../controllers/jobController');
const router = express.Router();


router.post('/createjob', createJob);

module.exports = router;