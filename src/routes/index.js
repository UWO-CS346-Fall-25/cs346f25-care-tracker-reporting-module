// src/routes/index.js (COMPLETE CODE)

const express = require('express');
const router = express.Router();

// Import controllers
const indexController = require('../controllers/indexController');

// --- STATIC PAGE ROUTES ---
router.get('/', indexController.getHome);
router.get('/about', indexController.getAbout);
router.get('/students', indexController.getStudents);
router.get('/accreditationreport', indexController.getAccreditationReport);
router.get('/caretrackerconfig', indexController.getCareTrackerConfig);

// --- DYNAMIC ROUTES ---
router.get('/classes', indexController.getClassesPage); 
router.get('/classReport', indexController.getClassReport);
router.get('/api/status', indexController.getSystemStatus); 

module.exports = router;