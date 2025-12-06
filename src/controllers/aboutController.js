/**
 * Controller: aboutController
 * Purpose: render About
 * Output: Redirects to /about or shows an error page
 */
exports.getAbout = async (req, res, next) => {
  try {
    res.render('about', {
      title: 'About',
    });
  } catch (error) {
    next(error);
  }
};
