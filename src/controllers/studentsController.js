const model = require('../models/studentsModel');

// Import models if needed
// const SomeModel = require('../models/SomeModel');

/**
 * GET /about
 * Display the about page
 */
exports.getStudents = async (req, res, next) => {
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

exports.getStudentByName = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'StudentByName',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
exports.getClassStudentByName = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    const classId = req.params.class_id;
    res.render('classStudentReport', {
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
exports.getSelfReport = async (req, res, next) => {
  try {
    const userId = '13652b4f-6f6a-41cc-a00c-22995b412870';
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('selfReport', {
      title: 'Student Report',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
