const HealthStatus = require('./health-status');

class HealthChecker {
    constructor() {
        this._checkers = [];
    }

    addCheck(check, name, failureStatus, tags) {
        const failureStatusKey = Object.keys(HealthStatus).find(status => HealthStatus[status].name.toLowerCase() === failureStatus.toLowerCase() || HealthStatus[status].value === failureStatus);
        if (!failureStatusKey) {
            throw new Error('Failure status not found');
        }
        if (tags.length === 0) {
            throw new Error('Tags cannot be empty');
        }
        this._checkers.push({
            check,
            name,
            failureStatus: HealthStatus[failureStatusKey],
            tags: tags
        });
    }

    async getStatus(tag = 'default') {
        const checkers = this._checkers.filter(c => c.tags.includes(tag));
        let status = HealthStatus.Healthy;
        const results = [];
        for (const checker of checkers) {
            try {
                await checker.check();
                results.push({
                    name: checker.name,
                    state: HealthStatus.Healthy.name,
                    data: { reason: '' }
                });
            } catch (err) {
                if (status.value > checker.failureStatus.value) {
                    status = checker.failureStatus;
                }
                results.push({
                    name: checker.name,
                    state: checker.failureStatus.name,
                    data: { reason: err.message }
                });
            }
        }
        return {
            status: status.name,
            checks: results,
        };
    }
}

module.exports = HealthChecker;
