// middleware/renderLogger.js
const { logVerbose, logError } = require('../models/loggingModel');

const AREA = 'renderMiddleware';

function renderLogger() {
  return (req, res, next) => {
    const originalRender = res.render;

    res.render = function (view, locals = {}, callback) {
      // Create minimal meta (avoid logging sensitive stuff)
      const meta = {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        view,
      };

      // Fire-and-forget logging so render isn't slowed down
      // (still best-effort with your failover + flush model)
      logVerbose('ViewRendered', `Rendered view: ${view}`, AREA, meta).catch(
        //Only logVerbose so it doesn't clutter the Terminal.
        (err) => logError('ViewRendered_LogFailed', err, AREA, meta)
      );

      // Call the original render with the same signature
      return originalRender.call(this, view, locals, callback);
    };

    next();
  };
}

module.exports = { renderLogger };
