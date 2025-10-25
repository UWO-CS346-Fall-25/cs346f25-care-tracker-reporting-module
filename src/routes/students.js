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
const studentsController = require('../controllers/studentsController');

// Define routes
router.get('/', studentsController.getStudents);

router.get('/studentReport/:name', studentsController.getStudentByName);
router.get(
  '/classStudentReport/:name/:class_id',
  studentsController.getClassStudentByName
);
router.get('/selfReport', studentsController.getSelfReport);

router.post('/addStudent', studentsController.addStudent);

// dummy comment

module.exports = router;
