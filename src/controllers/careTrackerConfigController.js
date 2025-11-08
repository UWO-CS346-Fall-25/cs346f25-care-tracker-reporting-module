const CareTrackerConfig = require('../models/careTrackerConfigModel');

exports.showConfigPage = async (req, res) => {
  try {
    const codes = await CareTrackerConfig.getAll();
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes,
      user: req.user || null,
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      form: {},
    });
  } catch (err) {
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes: [],
      error: err.message,
      user: req.user || null,
      csrfToken: req.csrfToken ? req.csrfToken() : '',
    });
  }
};

exports.addConfig = async (req, res) => {
  try {
    const newCodeData = {
      code_type: req.body.codeType,
      code_group: req.body.codeGroup,
      code_text: req.body.code,
      code_meaning: req.body.codeMeaning,
    };

    await CareTrackerConfig.create(newCodeData);

    res.redirect('/caretrackerconfig');
  } catch (err) {
    console.error('Error inserting data into Supabase:', err);
    res.status(500).send(`Error adding code: ${err.message}`);
  }
};
