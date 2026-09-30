// Redacted everywhere, including dev
export const ALWAYS_REDACT = [
  "req.headers.authorization",
  "req.headers.cookie",
  "authorization",
  "cookie",
  "password",
  "*.password",
  "*.*.password",
  "token",
  "*.token",
  "*.*.token",
  "accessToken",
  "*.accessToken",
  "*.*.accessToken",
  "refreshToken",
  "*.refreshToken",
  "*.*.refreshToken",
];

// Redacted only in production
export const PROD_ONLY_REDACT = [
  "email",
  "*.email",
  "*.*.email",
  "weight",
  "*.weight",
  "*.*.weight",
];