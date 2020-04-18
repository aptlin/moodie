const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  queues: {
    verification: {
      name: 'verification',
      cache: {
        host: process.env.VERIFICATION_NOTIFICATIONS_CACHE_HOST || 'localhost',
        port: 6379,
      },
    },
  },
});
export default appConfig;
