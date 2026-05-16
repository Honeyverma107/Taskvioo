function requireEnv(keys) {
  const missing = keys.filter((key) => !process.env[key]?.trim());
  if (missing.length === 0) return;

  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

function validateEnv() {
  requireEnv(['DATABASE_URL', 'JWT_SECRET']);

  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL?.trim()) {
    console.warn('Warning: CLIENT_URL is not set. CORS will allow all origins.');
  }
}

module.exports = { validateEnv };
