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
 * GET /
 * Display the home page
 */
exports.getHome = async (req, res, next) => {
  try {
    // Fetch any data needed for the home page
    // const data = await SomeModel.findAll();

    res.render('index', {
      title: 'Home',
      // data: data,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /about
 * Display the about page
 */
exports.getAbout = async (req, res, next) => {
  try {
    res.render('about', {
      title: 'About',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

const mockCourses = [
    { id: 'CS346', name: 'Web Development', seats: 25, instructor: 'Dr. Smith' },
    { id: 'CS420', name: 'Software Engineering', seats: 18, instructor: 'Prof. Jones' },
    { id: 'CS301', name: 'Data Structures', seats: 30, instructor: 'Dr. Lee' }
];

exports.getClassesPage = async (req, res, next) => { // <-- NEW FUNCTION
  try {
    const dataForView = {
        title: "Available Courses (Dynamic)",
        courses: mockCourses,
        lastUpdated: new Date().toLocaleString(),
        user: res.locals.user || null,
        csrfToken: req.csrfToken()
    };
    
    // Renders the existing 'classes.ejs' view
    res.render('classes', dataForView); 
  } catch (error) {
    next(error);
  }
};

exports.getSystemStatus = (req, res) => {
    // This is the mock data endpoint for client-side JavaScript (like in main.js)
    const status = {
        status: "OK",
        uptime: process.uptime(),
        message: "Server is running dynamically and API is reachable!",
        timestamp: new Date().toISOString()
    };
    
    // Sends the JSON response
    res.json(status); 
};

// Add more controller methods as needed

exports.getAccreditationReport = (req, res, next) => {
  try {
    res.render('accreditationReport', { title: 'Accreditation Report', csrfToken: req.csrfToken() });
  } catch (error) { next(error); }
};

exports.getStudentReport = (req, res, next) => {
  try {
    res.render('studentReport', { title: 'Student Report', csrfToken: req.csrfToken() });
  } catch (error) { next(error); }
};

exports.getStudents = (req, res, next) => {
  try {
    res.render('students', { title: 'Students', csrfToken: req.csrfToken() });
  } catch (error) { next(error); }
};

exports.getClasses = (req, res, next) => {
  try {
    res.render('classes', { title: 'Classes', csrfToken: req.csrfToken() });
  } catch (error) { next(error); }
};

exports.getClassReport = (req, res, next) => {
  try {
    res.render('classReport', { title: 'Class Report', csrfToken: req.csrfToken() });
  } catch (error) { next(error); }
};

exports.getCareTrackerConfig = (req, res, next) => {
  try {
    res.render('careTrackerConfig', { title: 'Care Tracker Config', csrfToken: req.csrfToken() });
  } catch (error) { next(error); }
};
