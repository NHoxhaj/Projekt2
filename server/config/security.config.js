const isProduction = process.env.NODE_ENV === 'production';

const parseOrigins = (value) => {
  if (!value) {
    return ['http://localhost:5173', 'http://localhost:5174'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseOrigins(process.env.CLIENT_ORIGINS);
const sameSite = process.env.COOKIE_SAME_SITE || 'lax';
const jwtSecrets = {
  user: process.env.USER_JWT_SECRET || process.env.FIRST_SECRET_KEY,
  admin: process.env.ADMIN_JWT_SECRET || process.env.FIRST_SECRET_KEY,
};

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite,
  maxAge: 60 * 60 * 1000,
};

const csrfCookieOptions = {
  httpOnly: false,
  secure: isProduction,
  sameSite,
  maxAge: 60 * 60 * 1000,
};

module.exports = {
  allowedOrigins,
  cookieOptions,
  csrfCookieOptions,
  isProduction,
  jwtSecrets,
};
