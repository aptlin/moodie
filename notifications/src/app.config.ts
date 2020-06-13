const appConfig = () => ({
  port: parseInt(process.env.NOTIFICATIONS_PORT, 10) || 3015,
  http: {
    timeout: 5000,
    maxRedirects: 5,
  },
  queues: {
    verification: {
      name: 'verification',
      host: process.env.CACHE_HOST || 'amqp://guest:guest@localhost:5672',
    },
  },
});
export default appConfig;
