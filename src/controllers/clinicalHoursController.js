const { logEvent, logError } = require('../models/loggingModel');
const area = 'clinicalHoursController.js';

require('dotenv').config();

const EDGE_FUNCTION_URL =
  'https://urnttpvujrpcizotlels.supabase.co/functions/v1/export_clinical_hours_csv'; ///URL to fetch Report.

// Use node-fetch via dynamic import
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * Controller: clinicalHoursController
 * Purpose: Fetches from supabase edge Function to return data as a csv.
 * Output: Download link for clinical_hours_export.csv or shows an error page
 */
exports.exportClinicalHoursCsv = async function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/users/login');
  }
  try {
    if (!req.session || !req.session.user || req.session.user.roleLevel != 2) {
      logError('Report Export', 'Unauthorized attempt', area, {
        ip: req.ip,
        user: req.session?.user ?? null,
      });
      return next(
        'Only managers are authorized to generate the clinical hours report.'
      );
    }

    logEvent('Report Export', 'Contacting edge function', area, {
      ip: req.ip,
      user: req.session.user.userId,
    });
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, //only the service can call this API..
      },
    });

    if (!response.ok) {
      const text = await response.text();
      logError('Report Export', 'Edge Function Failed: ' + text, area, {
        ip: req.ip,
        user: req.session?.user ?? null,
      });
      return next(
        'Failed to generate clinical hours export. Please try again or contact support.'
      );
    }

    const csv = await response.text();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="clinical_hours_export.csv"'
    );

    logEvent('Report Export', 'Edge Function success .sending res(CSV)', area, {
      ip: req.ip,
      user: req.session.user.userId,
      csvSize: Buffer.byteLength(csv, 'utf8'),
    });
    res.send(csv);
  } catch (err) {
    logError('Report Export', err, area, {
      ip: req.ip,
      user: req.session?.user ?? null,
    });
    if (next) return next(err);
    res
      .status(500)
      .send('Internal server error while exporting clinical hours.');
  }
};
