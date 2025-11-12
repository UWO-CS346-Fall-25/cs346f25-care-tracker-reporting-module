/**
 * Index Routes
 *
 * Define routes for the main pages of your application here.
 * Routes connect HTTP requests to controller functions.
 *
 * Example usage:
 * const express = require('express');
 * const router = express.Router();
 * const indexController = require('../controllers/indexController');
 *
 * router.get('/', indexController.getHome);
 * router.get('/about', indexController.getAbout);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();
const careTrackerConfigController = require('../controllers/careTrackerConfigController');

// Define routes
router.get('/', careTrackerConfigController.showConfigPage);
const controller = require('../controllers/careTrackerConfigController');

// Display table + form
router.get('/', controller.showConfigPage);

// Handle form submission
router.post('/add_config', controller.addConfig);

module.exports = router;
