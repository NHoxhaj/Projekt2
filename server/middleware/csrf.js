const crypto = require('crypto');
const { csrfCookieOptions } = require('../config/security.config');

const CSRF_COOKIE_NAME = 'csrfToken';
const CSRF_HEADER_NAME = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const getSecret = () => {
  if (!process.env.FIRST_SECRET_KEY) {
    throw new Error('FIRST_SECRET_KEY is required for CSRF protection');
  }

  return process.env.FIRST_SECRET_KEY;
};

const signToken = (token) =>
  crypto.createHmac('sha256', getSecret()).update(token).digest('hex');

const createCsrfToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return `${token}.${signToken(token)}`;
};

const isValidCsrfToken = (signedToken) => {
  if (!signedToken || typeof signedToken !== 'string') {
    return false;
  }

  const [token, signature] = signedToken.split('.');
  if (!token || !signature) {
    return false;
  }

  const expectedSignature = signToken(token);
  const provided = Buffer.from(signature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
};

const setCsrfCookie = (res, token = createCsrfToken()) => {
  res.cookie(CSRF_COOKIE_NAME, token, csrfCookieOptions);
  return token;
};

const issueCsrfToken = (req, res) => {
  const existingToken = req.cookies[CSRF_COOKIE_NAME];
  const csrfToken = isValidCsrfToken(existingToken) ? existingToken : setCsrfCookie(res);

  res.status(200).json({ csrfToken });
};

const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE_NAME];
  const headerToken = req.get(CSRF_HEADER_NAME);

  if (!isValidCsrfToken(cookieToken) || !headerToken || headerToken !== cookieToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
};

module.exports = {
  csrfProtection,
  issueCsrfToken,
};
