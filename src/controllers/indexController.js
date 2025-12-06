/**
 * Controller: indexController
 * Purpose: renders index
 * Output: Redirects to /index or shows an error page
 */
exports.getHome = async (req, res, next) => {
  try {
    var showStudentFeatures = false;
    var showTeacherFeatures = false;
    var showManagerFeatures = false;
    if (req.session && req.session.user) {
      if (req.session.user.roleLevel == 0) showStudentFeatures = true;
      if (req.session.user.roleLevel == 1) showTeacherFeatures = true;
      if (req.session.user.roleLevel == 2) showManagerFeatures = true;
    }

    res.render('index', {
      title: 'Home',
      showStudentFeatures: showStudentFeatures,
      showTeacherFeatures: showTeacherFeatures,
      showManagerFeatures: showManagerFeatures,
    });
  } catch (error) {
    next(error);
  }
};
