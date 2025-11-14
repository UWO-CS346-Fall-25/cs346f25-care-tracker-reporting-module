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
 // Route: GET /about → indexController.getAbout
 // Renders view 'about' with locals: title, //csrfToken.
 * router.get('/about', indexController.getAbout);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();

// Import controllers
const classesController = require('../controllers/classesController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', classesController.getClasses);

// Route: GET /class_report/:id → classesController.getClassById
// Renders view 'classReport' with locals: title.
// Uses route params (req.params) to drive controller logic.
router.get('/class_report/:id', classesController.getClassById);

// Route: POST /add_class → classesController.addClass
router.post('/add_class', classesController.addClass);

// dummy comment

module.exports = router;
