/**
 * Index Controller
 *
 * Controllers handle the business logic for routes.
 * They process requests, interact with models, and send responses.
 *
 * Best practices:
 * - Keep controllers focused on request/response handling
 * - Move complex business logic to separate service files
 * - Use models to interact with the database
 * - Handle errors appropriately
 */

// Import models if needed
// const SomeModel = require('../models/SomeModel');

/**
 * GET /about
 * Display the about page
 */
exports.getStudents = async (req, res, next) => {
  try {
    res.render('students', {
      title: 'Students',
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
/**
 * GET /about
 * Display the about page
 */
exports.getStudentByName = async (req, res, next) => {
  try {
    res.render('studentReport', {
      title: 'StudentByName',
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

// Add more controller methods as needed
