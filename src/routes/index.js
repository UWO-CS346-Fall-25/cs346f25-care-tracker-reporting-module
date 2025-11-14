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
 // Route: GET / → indexController.getHome
 // Renders view 'index' with locals: title, // data, //csrfToken.
 // Relies on model(s): SomeModel for database access.
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
const indexController = require('../controllers/indexController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', indexController.getHome);

// dummy comment

module.exports = router;
