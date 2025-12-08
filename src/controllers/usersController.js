/**
 * Users Controller
 *
 * Handles Supabase-based authentication.
 * Uses sessions to remember the logged-in user between requests.
 */

const { logEvent, logError } = require('../models/loggingModel');
const area = 'usersController.js';
const supabase = require('../models/supabase'); // same client used by your models
const usersModel = require('../models/usersModel');

function mapRoleLabel(roleLevel) {
  switch (roleLevel) {
    case 0:
      return 'Student';
    case 1:
      return 'Teacher';
    case 2:
      return 'Manager';
    default:
      return 'Unknown';
  }
}

/**
 * Controller: usersController
 * Purpose: render login
 * Output: Redirects to /users/login or shows an error page
 */
exports.getLogin = (req, res) => {
  // If already logged in, just go home (optional behavior)
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken ? req.csrfToken() : '',
    user: req.session ? req.session.user : null,
    error: null,
    email: '',
  });
};

/**
 * Controller: usersController
 * Purpose: render register
 * Output: Redirects to /users/register or shows an error page
 */
exports.getRegister = (req, res) => {
  // If already logged in, just go home (optional behavior)
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  res.render('register', {
    title: 'Register',
    csrfToken: req.csrfToken ? req.csrfToken() : '',
    user: req.session ? req.session.user : null,
    error: null,
    email: '',
  });
};

/**
 * Controller: usersController
 * Purpose: post login
 * Input: req.body { email, password }
 * Output: Redirects to / or shows an error page
 */
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  logEvent('User Login', 'Login started', area, {
    ip: req.ip,
    email: email,
  });

  try {
    // Call Supabase Auth: email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data || !data.session || !data.user) {
      if (error) logError('User Login', error, area, { email: email });
      else
        logError('User Login', 'Invalid email or password.', area, {
          email: email,
          ip: req.ip,
        });
      ///Something has gone wrong with our sign-in.
      return res.status(401).render('login', {
        title: 'Login',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        error: 'Invalid email or password.',
      });
    }

    const userId = data.user.id;
    const careData = await usersModel.getUserByUserId(userId); //If we have successfully logged into Supabase get our care_user data.

    if (error || !data || !careData || !data.session || !data.user) {
      if (error) logError('User Login', error, area, { email: email });
      else
        logError(
          'User Login',
          'Invalid account State.  Supabase Account found, but no care_user.',
          area,
          {
            email: email,
            ip: req.ip,
          }
        );
      ///We have a supabase account but not a care_user row?
      return res.status(401).render('login', {
        title: 'Login',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        error: 'Invalid account State.  Contact support.',
      });
    }

    // Store user info in the session
    req.session.user = {
      userId: data.user.id,
      email: data.user.email,
      firstName: careData.firstName,
      lastName: careData.lastName,
      fullName: careData.fullName,
      roleLevel: careData.roleLevel,
    };

    // Optionally keep the access token if you want user-specific queries later
    req.session.supabase = {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    logEvent('User Login', 'Login success', area, {
      email: email,
      ip: req.ip,
      userid: data.user.id,
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: usersController
 * Purpose: Create a new Supabase user, set role via joinCode
 * Input: req.body { email, password, firstName, lastName, joinCode }
 * Output: Redirects to / or shows an error page
 */
exports.postRegister = async (req, res, next) => {
  const { email, password, firstName, lastName, joinCode } = req.body;

  try {
    // --- Basic server-side validation ---
    const missingFields = [];
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!firstName) missingFields.push('First name');
    if (!lastName) missingFields.push('Last name');
    if (!joinCode) missingFields.push('Join code');

    // feedback on missing fields
    if (missingFields.length > 0) {
      return res.status(400).render('register', {
        title: 'Register',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        firstName,
        lastName,
        joinCode,
        error: `Please fill out: ${missingFields.join(', ')}.`,
      });
    }

    // feedback if user is attempting a non-uwosh email.
    if (!email.toLowerCase().endsWith('@uwosh.edu')) {
      return res.status(400).render('register', {
        title: 'Register',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        firstName,
        lastName,
        joinCode,
        error: `Only @uwosh.edu email addresses are accepted at this time.`,
      });
    }

    // test the join code for validity before we create a new supabase account.
    if (joinCode && joinCode.trim() !== '') {
      try {
        logEvent('User Registration', 'Testing joinCode:', area, {
          email: email,
          firstName: firstName,
          lastName: lastName,
          id: req.ip,
          joinCode: joinCode.trim(),
        });
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          //call the function to test the code.
          'is_join_code_available',
          { p_code: joinCode.trim() }
        );

        if (rpcError) {
          //error?
          logError(
            'User Registration',
            'Error testing joinCode:' + rpcError,
            area,
            {
              email: email,
              firstName: firstName,
              lastName: lastName,
              id: req.ip,
              joinCode: joinCode.trim(),
            }
          );
          return res.status(400).render('register', {
            title: 'Register',
            csrfToken: req.csrfToken ? req.csrfToken() : '',
            user: null,
            email,
            firstName,
            lastName,
            joinCode,
            error:
              error?.message ||
              'Unable to register. Please try again or contact support.',
          });
        } else {
          //no error
          if (rpcResult == true) {
            //the db function returns true if the code is available for use... invalid in this situation.
            return res.status(400).render('register', {
              title: 'Register',
              csrfToken: req.csrfToken ? req.csrfToken() : '',
              user: null,
              email,
              firstName,
              lastName,
              joinCode,
              error: `Invalid Join Code.  Contact your instructor.`,
            });
          }
        }
      } catch (rpcErr) {
        logError(
          'User Registration',
          'Error testing joinCode:' + rpcErr,
          area,
          {
            email: email,
            firstName: firstName,
            lastName: lastName,
            id: req.ip,
            joinCode: joinCode.trim(),
          }
        );
        return res.status(400).render('register', {
          title: 'Register',
          csrfToken: req.csrfToken ? req.csrfToken() : '',
          user: null,
          email,
          firstName,
          lastName,
          joinCode,
          error:
            error?.message ||
            'Unable to register. Please try again or contact support.',
        });
      }
    }

    ///We have validated we have all fields and the join code is valid.
    ///Start the actual registration.

    logEvent('User Registration', 'Registration started', area, {
      email: email,
      firstName: firstName,
      lastName: lastName,
    });

    // --- Create user in Supabase Auth ---
    const { data, error } = await supabase.auth.signUp({
      //send to Supabase.
      email,
      password,
      options: {
        // Store basic profile in user_metadata (optional, but nice)
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error || !data || !data.user) {
      if (error)
        logError('User Registration', error, area, {
          email: email,
          ip: req.ip,
          firstName: firstName,
          lastName: lastName,
        });
      else
        logError(
          'User Registration',
          'Registration failed, no error returned.',
          area,
          {
            email: email,
            ip: req.ip,
            firstName: firstName,
            lastName: lastName,
          }
        );
      return res.status(400).render('register', {
        title: 'Register',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        firstName,
        lastName,
        joinCode,
        error:
          error?.message ||
          'Unable to register. Please try again or contact support.',
      });
    }

    //Creating a supabase account creates a care_user row via trigger.  Get that user now.
    const userId = data.user.id;
    const careUser = await usersModel.getUserByUserId(userId);

    if (error || !careUser) {
      ///We have a supabase account but not a care_user row?
      if (error)
        logError('User Registration', error, area, {
          email: email,
          ip: req.ip,
          firstName: firstName,
          lastName: lastName,
        });
      else
        logError(
          'User Registration',
          'Supabase registered, but failed to return care_user.',
          area,
          {
            email: email,
            ip: req.ip,
            firstName: firstName,
            lastName: lastName,
          }
        );
      return res.status(401).render('login', {
        title: 'Login',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        error: 'Something went wrong.  Contact support.',
      });
    }

    if (joinCode && joinCode.trim() !== '') {
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          //attempt to map our user to the class and role matching the join code.
          'set_role_from_join_code',
          { joincode: joinCode.trim() }
        );

        if (rpcError) {
          logError(
            'User Registration',
            'Account Created, join code failed:' + rpcError,
            area,
            {
              email: email,
              ip: req.ip,
              firstName: firstName,
              lastName: lastName,
              joinCode: joinCode.trim(),
            }
          );
        } else {
          careUser.roleLevel = rpcResult; // We mapped successfully.  Assign the returned roleLevel.
        }
      } catch (rpcErr) {
        logError(
          'User Registration',
          'Account Created, join code failed:' + rpcErr,
          area,
          {
            email: email,
            ip: req.ip,
            firstName: firstName,
            lastName: lastName,
            joinCode: joinCode.trim(),
          }
        );
      }
    }

    // Store user info in the session
    req.session.user = {
      userId: data.user.id,
      email: data.user.email,
      firstName: careUser.firstName,
      lastName: careUser.lastName,
      fullName: careUser.fullName,
      roleLevel: careUser.roleLevel,
    };

    req.session.supabase = {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    logEvent('User Registration', 'Registration Complete', area, {
      email: email,
      ip: req.ip,
      firstName: firstName,
      lastName: lastName,
      userId: data.user.id,
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: usersController
 * Purpose: Clear current session and logout.
 * Input: req.body { email, password, firstName, lastName, joinCode }
 * Output: Redirects to / or shows an error page
 */
exports.postLogout = (req, res, _next) => {
  if (!req.session) {
    return res.redirect('/');
  }

  supabase.auth.signOut();
  req.session.destroy(() => {});
  res.clearCookie('sb-access-token');
  res.clearCookie('sb-refresh-token');
  res.redirect('/');
};

/**
 * Controller: usersController
 * Purpose: render profile
 * Output: Redirects to /users/profile or /users/login if not logged in.
 */
exports.getProfile = async (req, res, next) => {
  try {
    // Must be logged in
    if (!req.session || !req.session.user) {
      return res.redirect('/users/login');
    }

    const sessionUser = req.session.user;

    // Load the latest user info from v_users via the model
    const careData = await usersModel.getUserByUserId(sessionUser.userId);

    if (!careData) {
      return res.status(404).render('profile', {
        title: 'My Profile',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: sessionUser,
        profile: null,
        error: 'Profile not found.',
        success: null,
      });
    }

    // Sync session user with latest DB values
    req.session.user = {
      ...sessionUser,
      firstName: careData.firstName,
      lastName: careData.lastName,
      fullName: careData.fullName,
      roleLevel: careData.roleLevel,
    };

    const roleLabel = mapRoleLabel(careData.roleLevel);

    const profile = {
      email: sessionUser.email, // from session, not v_users
      firstName: careData.firstName,
      lastName: careData.lastName,
      roleLevel: careData.roleLevel,
      roleLabel,
    };

    res.render('profile', {
      title: 'My Profile',
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      user: req.session.user,
      profile,
      error: null,
      success: null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller: usersController
 * Purpose: render profile
 * Input: req.body { firstName, lastName }
 * Output: Redirects to /users/profile or /users/login if not logged in.
 */
exports.postProfile = async (req, res, next) => {
  const { firstName, lastName } = req.body;

  try {
    if (!req.session || !req.session.user) {
      return res.redirect('/users/login');
    }

    const sessionUser = req.session.user;
    const errors = [];

    if (!firstName || !firstName.trim()) errors.push('First name is required.');
    if (!lastName || !lastName.trim()) errors.push('Last name is required.');

    if (errors.length > 0) {
      const roleLabel = mapRoleLabel(sessionUser.roleLevel);

      const profile = {
        email: sessionUser.email,
        firstName,
        lastName,
        roleLevel: sessionUser.roleLevel,
        roleLabel,
      };

      return res.status(400).render('profile', {
        title: 'My Profile',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: sessionUser,
        profile,
        error: errors.join(' '),
        success: null,
      });
    }

    logEvent('Profile Update', 'Update started', area, {
      firstName: firstName,
      lastName: lastName,
      userId: req.session.user.userId,
    });

    // Update care_users via your Supabase function wrapped in the model
    const updated = await usersModel.createUpdateCareUser(
      firstName.trim(),
      lastName.trim(),
      sessionUser.userId
    );

    // Sync session with updated values
    req.session.user = {
      ...sessionUser,
      firstName: updated.firstName,
      lastName: updated.lastName,
      fullName: updated.fullName,
      roleLevel: updated.roleLevel,
    };

    const roleLabel = mapRoleLabel(updated.roleLevel);

    const profile = {
      email: sessionUser.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      roleLevel: updated.roleLevel,
      roleLabel,
    };

    logEvent('Profile Update', 'Update successful', area, {
      firstName: firstName,
      lastName: lastName,
      userId: req.session.user.userId,
    });

    res.render('profile', {
      title: 'My Profile',
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      user: req.session.user,
      profile,
      error: null,
      success: 'Profile updated successfully.',
    });
  } catch (err) {
    logError('Profile Update', err, area, {
      firstName: firstName,
      lastName: lastName,
      userId: req.session.user.userId,
    });
    next(err);
  }
};
