// routes/example.routes.js
const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/controllers');
const dbMiddleware = require('../database/database');

router.get('/data', dbMiddleware, exampleController.getData);

module.exports = router;