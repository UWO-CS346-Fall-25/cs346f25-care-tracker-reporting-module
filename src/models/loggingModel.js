/**
 * loggingModel.js (CommonJS)
 *
 * Server-side logging wrapper for Supabase event_log via RPC:
 *   public.write_event_log(...)
 *
 * Features:
 * - Public functions: logEvent, logError, logVerbose
 * - event_level is determined by which function is called
 * - event_source is determined by EVENT_SOURCE constant
 * - logError supports "overload-style" usage with either a message or an exception
 * - Exception message includes concatenated inner exceptions via JS Error.cause chain
 *
 * Reliability:
 * - Failover mode: only writes to local file if DB insert fails
 * - Catch-up: each DB attempt starts by flushing existing local logs to DB first
 * - Flush preserves chronological order as best as possible via created_at sort
 * - Successfully flushed lines are removed; empty files are deleted
 *
 * SECURITY NOTE:
 * This module uses SUPABASE_SERVICE_ROLE_KEY.
 * Do NOT import into client-side bundles.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ------------------------------
// Configuration
// ------------------------------

// Pre-determined source for all logs created via this module.
// Change to match your app identity (e.g., "website", "admin-api", "cron").
const EVENT_SOURCE = 'website';

// Levels determined by function called.
const LEVEL_EVENT = 'event';
const LEVEL_ERROR = 'error';
const LEVEL_VERBOSE = 'verbose';

// Local log folder in project root
const LOG_DIR = path.join(process.cwd(), 'logs');
const FLUSH_LOCK_PATH = path.join(LOG_DIR, '.flush.lock');

// ------------------------------
// Environment + Safety Guards
// ------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Hard guard: if this somehow runs in a browser, stop.
const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  throw new Error(
    'loggingModel.js was loaded in a browser environment. ' +
      'This is unsafe because it requires SUPABASE_SERVICE_ROLE_KEY.'
  );
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.'
  );
}

// Create a service-role Supabase client (server-only).
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ------------------------------
// Helpers - error message building
// ------------------------------

function getBaseErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message || err.toString();
  if (typeof err.message === 'string') return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Walk JS "cause" chain (closest analog to .NET InnerException)
 * and concatenate messages.
 */
function buildExceptionMessage(err) {
  const messages = [];
  const seen = new Set();

  let current = err;
  while (current && !seen.has(current)) {
    seen.add(current);

    const msg = getBaseErrorMessage(current);
    if (msg) messages.push(msg);

    // Standard modern JS inner exception pattern:
    // new Error("x", { cause: inner })
    current = current.cause;
  }

  if (messages.length === 0) {
    messages.push(getBaseErrorMessage(err));
  }

  if (messages.length === 1) return messages[0];

  return [messages[0], ...messages.slice(1).map((m) => `Cause: ${m}`)].join(
    ' | '
  );
}

// ------------------------------
// Helpers - local file logging (NDJSON)
// ------------------------------

function getDateStamp(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`; // YYYYMMDD
}

async function appendLocalLog(entry) {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });

    const dateStamp = getDateStamp(
      entry.created_at ? new Date(entry.created_at) : new Date()
    );
    const filePath = path.join(LOG_DIR, `log${dateStamp}.log`);

    // NDJSON: one JSON object per line
    const line = JSON.stringify(entry) + '\n';
    await fs.promises.appendFile(filePath, line, 'utf8');
  } catch (e) {
    // Don't break app flow if file logging fails
    console.error('Failed to write local log file:', e);
  }
}

// ------------------------------
// Helpers - DB insert
// ------------------------------

async function insertLogToDb(entry) {
  const { data, error } = await supabaseAdmin.rpc('write_event_log', {
    p_event_level: entry.event_level,
    p_event_source: entry.event_source,
    p_event_area: entry.event_area,
    p_event_name: entry.event_name,
    p_event_message: entry.event_message,
    p_event_meta_data: entry.event_meta_data,
  });

  if (error) return { ok: false, error };
  return { ok: true, id: data ?? null };
}

// ------------------------------
// Helpers - flush lock
// ------------------------------

async function tryAcquireFlushLock() {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });
    // "wx" => create file exclusively; fail if it already exists
    const handle = await fs.promises.open(FLUSH_LOCK_PATH, 'wx');
    await handle.close();
    return true;
  } catch {
    return false;
  }
}

async function releaseFlushLock() {
  try {
    await fs.promises.unlink(FLUSH_LOCK_PATH);
  } catch {
    // ignore
  }
}

// ------------------------------
// Helpers - reading pending log files
// ------------------------------

async function listLogFiles() {
  try {
    const files = await fs.promises.readdir(LOG_DIR);
    return files
      .filter((f) => /^log\d{8}\.log$/i.test(f))
      .map((f) => path.join(LOG_DIR, f))
      .sort(); // alphabetical matches date order in filename
  } catch {
    return [];
  }
}

async function readFileLines(filePath) {
  const text = await fs.promises.readFile(filePath, 'utf8');
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Flush any locally stored logs to DB, preserving chronological order as best as possible.
 * Successfully inserted lines are removed from files.
 * Empty files are deleted.
 *
 * Stops on first DB failure to avoid inserting later logs ahead of earlier ones.
 */
async function flushLocalLogsToDb() {
  const hasLock = await tryAcquireFlushLock();
  if (!hasLock) return;

  try {
    const files = await listLogFiles();
    if (files.length === 0) return;

    const all = [];
    const fileLineCache = new Map(); // filePath -> originalLines[]

    for (const filePath of files) {
      const lines = await readFileLines(filePath);
      fileLineCache.set(filePath, lines);

      lines.forEach((rawLine, lineIndex) => {
        try {
          const entry = JSON.parse(rawLine);
          all.push({
            entry,
            filePath,
            lineIndex,
            rawLine,
          });
        } catch {
          // If a line is corrupted, leave it in place.
        }
      });
    }

    if (all.length === 0) return;

    // Global chronological sort
    all.sort((a, b) => {
      const ta = Date.parse(a.entry.created_at ?? '') || 0;
      const tb = Date.parse(b.entry.created_at ?? '') || 0;
      if (ta !== tb) return ta - tb;
      if (a.filePath !== b.filePath)
        return a.filePath.localeCompare(b.filePath);
      return a.lineIndex - b.lineIndex;
    });

    const successByFile = new Map(); // filePath -> Set(lineIndex)

    for (const item of all) {
      const entry = item.entry;

      // Basic shape guard
      if (!entry || !entry.event_level || !entry.event_source) {
        continue;
      }

      const result = await insertLogToDb(entry);
      if (!result.ok) {
        // DB likely down; stop to preserve ordering guarantee
        break;
      }

      if (!successByFile.has(item.filePath)) {
        successByFile.set(item.filePath, new Set());
      }
      successByFile.get(item.filePath).add(item.lineIndex);
    }

    // Rewrite files removing successfully inserted lines
    for (const [filePath, successSet] of successByFile.entries()) {
      const originalLines = fileLineCache.get(filePath) || [];
      const remaining = originalLines.filter((_, idx) => !successSet.has(idx));

      if (remaining.length === 0) {
        await fs.promises.unlink(filePath).catch(() => {});
      } else {
        const newText = remaining.join('\n') + '\n';
        await fs.promises.writeFile(filePath, newText, 'utf8');
      }
    }
  } catch (e) {
    console.error('Failed during local log flush:', e);
  } finally {
    await releaseFlushLock();
  }
}

// ------------------------------
// Core writeLog with failover + catch-up
// ------------------------------

async function writeLog({
  level,
  area = null,
  name = null,
  message = null,
  metaData = null,
}) {
  const logEntry = {
    created_at: new Date().toISOString(),
    event_level: level,
    event_source: EVENT_SOURCE,
    event_area: area,
    event_name: name,
    event_message: message,
    event_meta_data: metaData,
  };

  // 1) Attempt to flush any backlog first
  await flushLocalLogsToDb();

  // 2) Try DB for current entry
  const result = await insertLogToDb(logEntry);
  if (result.ok) {
    return result.id;
  }

  // 3) Failover: only save locally if DB fails
  console.error('Failed to write event_log (will save locally):', result.error);
  await appendLocalLog(logEntry);

  return null;
}

// ------------------------------
// Public API
// ------------------------------

/**
 * logEvent(eventName, message, area?, metaData?)
 */
async function logEvent(eventName, message, area = null, metaData = null) {
  console.log(`[${new Date().toISOString()} ${eventName} ${area} ${message}.`);
  return writeLog({
    level: LEVEL_EVENT,
    area,
    name: eventName,
    message: message ?? null,
    metaData,
  });
}

/**
 * logVerbose(eventName, message, area?, metaData?)
 */
async function logVerbose(eventName, message, area = null, metaData = null) {
  //We don't log verbose to terminal.  The DB can be filtered so we only log them there.

  return writeLog({
    level: LEVEL_VERBOSE,
    area,
    name: eventName,
    message: message ?? null,
    metaData,
  });
}

/**
 * logError overload-like behavior:
 *
 * 1) logError(eventName, message, area?, metaData?)
 * 2) logError(eventName, exception, area?, metaData?)
 *
 * If second argument looks Error-like, derive event_message from exception + cause chain.
 */
async function logError(
  eventName,
  messageOrException,
  area = null,
  metaData = null
) {
  let finalMessage = null;

  const isErrorLike =
    messageOrException instanceof Error ||
    (messageOrException &&
      typeof messageOrException === 'object' &&
      ('message' in messageOrException || 'cause' in messageOrException));

  if (isErrorLike) {
    finalMessage = buildExceptionMessage(messageOrException);
  } else {
    finalMessage =
      typeof messageOrException === 'string'
        ? messageOrException
        : getBaseErrorMessage(messageOrException);
  }

  console.error(
    `[${new Date().toISOString()} ${eventName} ${area} ${finalMessage}.`
  );

  return writeLog({
    level: LEVEL_ERROR,
    area,
    name: eventName,
    message: finalMessage,
    metaData,
  });
}

// Optional export for debugging/consumers
const LOG_SOURCE = EVENT_SOURCE;

// ------------------------------
// Exports
// ------------------------------
module.exports = {
  logEvent,
  logError,
  logVerbose,
  LOG_SOURCE,
};
