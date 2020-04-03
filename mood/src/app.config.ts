const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  http: {
    timeout: 5000,
    maxRedirects: 5,
  },
  database: {
    host:
      process.env.EXPERIENCE_DATABASE_HOST || 'mongodb://localhost:27017/mood',
  },
  auth: {
    uri: process.env.EXPERIENCE_AUTH_PROVIDER || 'http://localhost:3010',
    verificationEndpoint:
      process.env.EXPERIENCE_AUTH_VERIFICATION_ENDPOINT || 'auth/validate',
  },
});
console.log(appConfig());
export default appConfig;
