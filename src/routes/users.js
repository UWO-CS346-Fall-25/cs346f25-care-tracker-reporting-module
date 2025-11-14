/**
 * User Routes
 *
 * Define routes related to user operations here.
 * This could include:
 * - User registration
 * - User login/logout
 * - User profile
 * - User management (admin)
 *
 * Example usage:
 * const express = require('express');
 * const router = express.Router();
 * const userController = require('../controllers/userController');
 *
 // Route: GET /register → userController.getRegister
 * router.get('/register', userController.getRegister);
 // Route: POST /register → userController.postRegister
 // Uses form/body fields (req.body) to drive controller logic.
 // Relies on model(s): User for database access.
 * router.post('/register', userController.postRegister);
 // Route: GET /login → userController.getLogin
 * router.get('/login', userController.getLogin);
 // Route: POST /login → userController.postLogin
 // Renders view 'users/login' with locals: //     title, //     error, //     csrfToken.
 // Uses form/body fields (req.body) to drive controller logic.
 * router.post('/login', userController.postLogin);
 // Route: POST /logout → userController.postLogout
 * router.post('/logout', userController.postLogout);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();

// Import controllers
// const userController = require('../controllers/userController');

// Define routes
// Route: GET /register → userController.getRegister
// router.get('/register', userController.getRegister);
// Route: POST /register → userController.postRegister
// Uses form/body fields (req.body) to drive controller logic.
// Relies on model(s): User for database access.
// router.post('/register', userController.postRegister);

module.exports = router;
