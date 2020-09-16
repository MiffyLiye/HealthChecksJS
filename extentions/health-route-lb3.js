const HealthChecker = require('./src/health-checker');
const HealthStatus = require('./src/health-status');

module.exports = async (app) => {
  app.get('/health', async (req, res) => {
    if (!app.lib.health) {
      app.lib.health = new HealthChecker();
    }

    const tag = req.query.filter && req.query.filter.tag;
    const result = await app.lib.health.getStatus(tag);
    if (result.status === HealthStatus.Healthy.name) {
      return res.status(200).send(result);
    } else {
      return res.status(500).send(result);
    }
  });
};
