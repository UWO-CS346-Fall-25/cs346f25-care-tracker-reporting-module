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
const studentsController = require('../controllers/studentsController');

// Define routes
// Route: GET / → indexController.getHome
// Renders view 'index' with locals: title, // data, //csrfToken.
// Relies on model(s): SomeModel for database access.
router.get('/', studentsController.getStudents);

router.get(
  '/studentReport/:name/:user_id',
  studentsController.getStudentByName
);
router.get(
  '/classStudentReport/:name/:user_id/:class_id',
  studentsController.getClassStudentByName
);
// Route: GET /selfReport → studentsController.getSelfReport
// Renders view 'selfReport' with locals: title, student_name, competencies, progressData, //csrfToken.
// Uses route params (req.params) to drive controller logic.
router.get('/selfReport', studentsController.getSelfReport);

// dummy comment

module.exports = router;
