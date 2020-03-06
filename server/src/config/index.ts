const appConfig = {
  rest: {
    port: process.env.PORT || 8080,
    mode: process.env.NODE_ENV || "production",
    parsingLimit: "20mb"
  },
  db: {
    uri: process.env.DB_URI || "mongodb://localhost"
  },
  auth: {
    accessTokenExpiration: process.env.AUTH_ACCESS_TOKEN_EXPIRATION
      ? parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION)
      : 300 * 1000,
    refreshTokenExpiration: process.env.AUTH_REFRESH_TOKEN_EXPIRATION
      ? parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION)
      : 900 * 1000,
    secret:
      process.env.AUTH_JWT_SECRET || "de9e5869-5aef-4750-8077-79d13bc27cbc",
    saltFactor: 5
  },
  errors: {
    INVALID_EMAIL: "INVALID_EMAIL",
    INVALID_URL: "INVALID_URL",
    NOT_FOUND: "NOT_FOUND",
    MALFORMED_ID: "MALFORMED_ID",
    COULD_NOT_FILTER: "COULD_NOT_FILTER"
  },
  success: {
    DELETED: "DELETED"
  }
};
export default appConfig;
