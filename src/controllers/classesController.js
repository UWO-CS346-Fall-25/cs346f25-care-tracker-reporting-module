/**
 * Controller: Handles HTTP request/response flow for this feature.
 */

const classesModel = require('../models/classesModel');
const studentsModel = require('../models/studentsModel');

/**
 * Controller: classesController
 * Purpose: renders classes
 * Output: Redirects to /classes or shows an error page
 */
exports.getClasses = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const allClasses = await classesModel.getAll();
    res.render('classes', {
      title: 'Classes',
      courses: allClasses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: classesController
 * Purpose: renders classReport
 * Input: req.params.id (uuid)
 * Output: Redirects to /classes/class_report/:id or shows an error page
 */
exports.getClassById = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const courseId = req.params.id;
    const course = await classesModel.getClassByClassId(courseId);
    const students = await studentsModel.getStudentsByClassId(courseId);

    if (!course) {
      return res.status(404).render('error', {
        title: 'Class Not Found',
        message: `Course with ID "${courseId}" was not found.`,
        error: { status: 404 },
      });
    }
    res.render('classReport', {
      title: `Report for ${course.classNumber}: ${course.className}`,
      course: course,
      students: students,
    });
  } catch (error) {
    next(error);
  }
};
