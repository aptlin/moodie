const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  http: {
    timeout: 5000,
    maxRedirects: 5,
  },
  database: {
    host: process.env.MOOD_DATABASE_HOST || 'mongodb://localhost:27017/mood',
  },
  auth: {
    uri: process.env.MOOD_AUTH_PROVIDER || 'http://localhost:3010',
    verificationEndpoint:
      process.env.MOOD_AUTH_VERIFICATION_ENDPOINT || 'auth/validate',
  },
});
export default appConfig;
