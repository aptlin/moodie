const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'mongodb://localhost/auth',
  },
  auth: {
    accessTokenExpiration: process.env.AUTH_ACCESS_TOKEN_EXPIRATION
      ? parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION)
      : 3600,
    refreshTokenExpiration: process.env.AUTH_REFRESH_TOKEN_EXPIRATION
      ? parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION)
      : 3600 * 30,
    secret:
      process.env.AUTH_JWT_SECRET || 'de9e5869-5aef-4750-8077-79d13bc27cbc',
  },
});

export default appConfig;
