const CareTrackerConfig = require('../models/careTrackerConfigModel');
const { logEvent, logError } = require('../models/loggingModel');
const area = 'careTrackerConfigController.js';

/**
 * Controller: careTrackerConfigController
 * Purpose: render Config Page
 * Output: Redirects to /careTrackerConfig or shows an error page
 */
exports.showConfigPage = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const codes = await CareTrackerConfig.getAll();
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes,
      user: req.session?.user || null,
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      form: {},
    });
  } catch (err) {
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes: [],
      error: err.message,
      user: req.session?.user || null,
      csrfToken: req.csrfToken ? req.csrfToken() : '',
    });
  }
};

/**
 * Controller: careTrackerConfigController
 * Purpose: add new Dropdown Code to the db
 * Input: req.body.codeType (string)
 *          ..codeGroup (string)
 *          ..code (string)
 *          ..codeMeaning (string)
 * Output: Refreshes /careTrackerConfig or shows an error page
 */
exports.addConfig = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    const user = req.session?.user || null;
    const newCodeData = {
      code_type: req.body.codeType,
      code_group: req.body.codeGroup,
      code_text: req.body.code,
      code_meaning: req.body.codeMeaning,
    };

    if (!user || user.roleLevel !== 2) {
      logError(
        'Add Config Code',
        'Forbidden: only managers can delete codes.',
        area,
        {
          ip: req.ip,
          user: user,
          newCode: newCodeData,
        }
      );
      return res.status(403).send('Forbidden: only managers can delete codes.');
    }
    logEvent('Add Config Code', 'Add Code started', area, {
      ip: req.ip,
      user: req.session.user.userId,
      newCode: newCodeData,
    });

    await CareTrackerConfig.create(newCodeData);

    logEvent('Add Config Code', 'Add Code successful', area, {
      ip: req.ip,
      user: req.session.user.userId,
      newCode: newCodeData,
    });
    res.redirect('/caretrackerconfig');
  } catch (err) {
    logError('Add Config Code', err, area, {
      ip: req.ip,
      user: req.session.user.userId,
      newCode: {
        code_type: req.body.codeType,
        code_group: req.body.codeGroup,
        code_text: req.body.code,
        code_meaning: req.body.codeMeaning,
      },
    });
    res.status(500).send(`Error adding code: ${err.message}`);
  }
};

/**
 * Controller: careTrackerConfigController
 * Purpose: deletes a Dropdown Code to the db
 * Input: req.body (int)
 * Output: Refreshes /careTrackerConfig or shows an error page
 */
exports.deleteConfig = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    if (!req.session || !req.session.user) {
      return res.redirect('/users/login');
    }
    const user = req.session?.user || null;
    const { codeId } = req.body;

    if (!user || user.roleLevel !== 2) {
      logError(
        'Add Config Code',
        'Forbidden: only managers can delete codes.',
        area,
        {
          ip: req.ip,
          user: user,
          codeId: codeId,
        }
      );
      return res.status(403).send('Forbidden: only managers can delete codes.');
    }

    if (!codeId) {
      return res.status(400).send('Missing codeId.');
    }

    await CareTrackerConfig.deleteById(codeId);

    logEvent('Add Config Code', 'Add Code successful', area, {
      ip: req.ip,
      user: req.session.user.userId,
      codeId: codeId,
    });
    res.redirect('/caretrackerconfig');
  } catch (err) {
    logError('Add Config Code', err, area, {
      ip: req.ip,
      user: req.session.user.userId,
      codeId: req.body,
    });
    res.status(500).send(`Error deleting code: ${err.message}`);
  }
};
