let allClasses = [
  {
    id: 'CS271',
    name: 'Data Structures',
    students: ['Alice Johnson', 'Bob Williams', 'Charlie Brown'],
  },
  {
    id: 'CS346',
    name: 'Web Development',
    students: ['David Lee', 'Eve Martinez', 'Frank White'],
  },
  {
    id: 'CS344',
    name: 'Mobile Development',
    students: ['Grace Hall', 'Henry King', 'Ivy Miller'],
  },
];

// Import models if needed
// const SomeModel = require('../models/SomeModel');

/**
 * GET /about
 * Display the about page
 */
exports.getClasses = async (req, res, next) => {
  try {
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
    const course = allClasses.find((c) => c.id === courseId);

    if (!course) {
      return res.status(404).render('error', {
        title: 'Class Not Found',
        message: `Course with ID "${courseId}" was not found.`,
        error: { status: 404 },
      });
    }
    res.render('classReport', {
      title: `Report for ${course.id}: ${course.name}`,
      class_name: `${course.id}: ${course.name}`,
      course: course,
      class_id: course.id,
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

  allClasses.push(newClass);

  // Re-render or redirect
  res.redirect('/classes'); // will show the updated list
};
