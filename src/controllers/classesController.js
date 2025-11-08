const classesModel = require('../models/classesModel');
const studentsModel = require('../models/studentsModel');

exports.getClasses = async (req, res, next) => {
  try {
    const allClasses = await classesModel.getAll();
    res.render('classes', {
      title: 'Classes',
      courses: allClasses,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassById = async (req, res, next) => {
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
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /students/add
exports.addClass = (req, res) => {
  // const { id } = req.body.id;
  // const { name } = req.body.name;
  // if (!id || !id.trim()) {
  //   return res.status(400).send(req.body.id);
  // }
  // if (!name || !name.trim()) {
  //   return res.status(400).send('Name required');
  // }

  const newClass = {
    id: req.body.id.trim(),
    name: req.body.name.trim(),
  };

  //allClasses.push(newClass);

  // Re-render or redirect
  res.redirect('/classes'); // will show the updated list
};
