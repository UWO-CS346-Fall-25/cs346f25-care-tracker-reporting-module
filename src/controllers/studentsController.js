/**
 * Controller: Handles HTTP request/response flow for this feature.
 */

const model = require('../models/studentsModel');

/**
 * Controller: studentsController
 * Purpose: renders students
 * Output: Redirects to /students or shows an error page
 */
exports.getStudents = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const allStudents = await model.getAll();
    res.render('students', {
      title: 'Students',
      students: allStudents,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: studentsController
 * Purpose: renders studentReport
 * Input: req.params.user_id (uuid)
 *        req.params.req.params.name (string)
 * Output: Redirects to /students/studentReport/:name/:user_id or shows an error page
 */
exports.getStudentReportByUserID = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'StudentByName',
      backUrl: '/students',
      backLabel: '← Back to Students',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: studentsController
 * Purpose: renders studentReport
 * Input: req.params.user_id (uuid)
 *        req.params.class_id (uuid)
 *        req.params.req.params.name (string)
 * Output: Redirects to /students/classStudentReport/:name/:user_id/:class_id or shows an error page
 */
exports.getClassStudentByUserId = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    const classId = req.params.class_id;
    res.render('studentReport', {
      title: 'StudentByName',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      class_id: classId,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: studentsController
 * Purpose: renders studentReport
 * Output: Redirects to /students/selfReport or shows an error page
 */
exports.getSelfReport = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const userId = req.session.user.userId;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'Student Report',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
    });
  } catch (error) {
    next(error);
  }
};
