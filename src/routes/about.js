/**
 * Index Routes
 *
 * Define routes for the main pages of your application here.
 * Routes connect HTTP requests to controller functions.
 *
 * Example usage:
 * const express = require('express');
 * const router = express.Router();
 * const indexController = require('../controllers/indexController');
 *
 * router.get('/', indexController.getHome);
 * router.get('/about', indexController.getAbout);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();

// Import controllers
const aboutController = require('../controllers/aboutController');

// Define routes
router.get('/', aboutController.getAbout);

router.post('/hello', (req, res) => {
  res.send(
    `<h1>Hello Express app!</h1>Here is your posted data:` +
      `<ul><li>${req.body.name}</li><li>${req.body.age}</li></ul>`
  );
});
// dummy comment

module.exports = router;
