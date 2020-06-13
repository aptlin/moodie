const config = {
  auth: {
    uri: process.env.AUTH_PROVIDER || 'http://localhost:3010',
    verificationEndpoint:
      process.env.AUTH_VERIFICATION_ENDPOINT || 'auth/validate',
  },
};
export default config;
