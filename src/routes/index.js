// src/routes/index.js (COMPLETE CODE)

const express = require('express');
const router = express.Router(); // <-- DEFINES ROUTER

// Use the logically correct path (adjust to '../../src/controllers/indexController' ONLY if 'Cannot find module' error returns)
const indexController = require('../controllers/indexController');

// Define all static page routes here, pointing to the appropriate controller methods
router.get('/', indexController.getHome);
router.get('/about', indexController.getAbout);
router.get('/accreditationreport', indexController.getAccreditationReport);
router.get('/studentreport', indexController.getStudentReport);
router.get('/students', indexController.getStudents);
router.get('/classes', indexController.getClassesPage);
router.get('/api/status', indexController.getSystemStatus);
router.get('/classreport', indexController.getClassReport);
router.get('/caretrackerconfig', indexController.getCareTrackerConfig);

module.exports = router;