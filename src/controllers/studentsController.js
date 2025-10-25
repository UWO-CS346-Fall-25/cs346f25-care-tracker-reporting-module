let allStudents = [
  { id: 1, name: 'Lena Martinez' },
  { id: 2, name: 'Caleb Nguyen' },
  { id: 3, name: 'Ava Thompson' },
  { id: 4, name: 'Alice Johnson' },
  { id: 5, name: 'Bob Williams' },
  { id: 6, name: 'Charlie Brown' },
  { id: 7, name: 'David Lee' },
  { id: 8, name: 'Eve Martinez' },
  { id: 9, name: 'Frank White' },
  { id: 10, name: 'Grace Hall' },
  { id: 11, name: 'Henry King' },
  { id: 12, name: 'Ivy Miller' },
];

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
      students: allStudents,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentByName = async (req, res, next) => {
  try {
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'StudentByName',
      student_name: studentName,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
exports.getClassStudentByName = async (req, res, next) => {
  try {
    const studentName = req.params.name;
    const classId = req.params.class_id;
    res.render('classStudentReport', {
      title: 'StudentByName',
      student_name: studentName,
      class_id: classId,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
exports.getSelfReport = async (req, res, next) => {
  try {
    const studentName = req.params.name;
    res.render('selfReport', {
      title: 'Student Report',
      student_name: studentName,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /students/add
exports.addStudent = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).send('Name required');
  }

  const newStudent = {
    id: allStudents.length > 0 ? allStudents[allStudents.length - 1].id + 1 : 1,
    name: name.trim(),
  };

  allStudents.push(newStudent);
  // Re-render or redirect
  res.redirect('/students'); // will show the updated list
};
