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

// Import controllers
const classesController = require('../controllers/classesController');

// Define routes
router.get('/', classesController.getClasses);

router.get('/class_report/:id', classesController.getClassById);

router.post('/add_class', classesController.addClass);

// dummy comment

module.exports = router;
