const HealthChecker = require('../src/health-checker');

describe('Health Checker', () => {
    let healthChecker;
    beforeEach(() => {
        healthChecker = new HealthChecker();
    });

    it('should return healthy status when there is no check', async () => {
        healthChecker = new HealthChecker();

        const res = await healthChecker.getStatus({});

        expect(res.status).toBe('healthy');
    });

    it('should return healthy status when all checks health', async () => {
        healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy-1', 'unhealthy', ['default']);
        healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy-2', 'unhealthy', ['default']);

        const res = await healthChecker.getStatus();

        expect(res.status).toBe('healthy');
        expect(res.checks[0].name).toBe('always-healthy-1');
        expect(res.checks[0].state).toBe('healthy');
        expect(res.checks[1].name).toBe('always-healthy-2');
        expect(res.checks[1].state).toBe('healthy');
    });

    it('should return unhealthy status when one check unhealth', async () => {
        healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy', 'unhealthy', ['default']);
        healthChecker.addCheck(async () => {
            throw new Error('Failure')
        }, 'always-unhealthy', 'unhealthy', ['default']);

        const res = await healthChecker.getStatus();

        expect(res.status).toBe('unhealthy');
        expect(res.checks[0].name).toBe('always-healthy');
        expect(res.checks[0].state).toBe('healthy');
        expect(res.checks[1].name).toBe('always-unhealthy');
        expect(res.checks[1].state).toBe('unhealthy');
        expect(res.checks[1].data.reason).toBe('Failure');
    });

    it('should return degraded status when one check degraded', async () => {
        healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy', 'unhealthy', ['default']);
        healthChecker.addCheck(async () => {
            throw new Error('Failure')
        }, 'always-degraded', 'degraded', ['default']);

        const res = await healthChecker.getStatus();

        expect(res.status).toBe('degraded');
        expect(res.checks[0].name).toBe('always-healthy');
        expect(res.checks[0].state).toBe('healthy');
        expect(res.checks[1].name).toBe('always-degraded');
        expect(res.checks[1].state).toBe('degraded');
        expect(res.checks[1].data.reason).toBe('Failure');
    });

    it('should return lowest status', async () => {
        healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy', 'unhealthy', ['default']);
        healthChecker.addCheck(async () => {
            throw new Error('Failure')
        }, 'always-unhealthy', 'unhealthy', ['default']);
        healthChecker.addCheck(async () => {
            throw new Error('Failure')
        }, 'always-degraded', 'degraded', ['default']);

        const res = await healthChecker.getStatus();

        expect(res.status).toBe('unhealthy');
        expect(res.checks[0].name).toBe('always-healthy');
        expect(res.checks[0].state).toBe('healthy');
        expect(res.checks[1].name).toBe('always-unhealthy');
        expect(res.checks[1].state).toBe('unhealthy');
        expect(res.checks[1].data.reason).toBe('Failure');
        expect(res.checks[2].name).toBe('always-degraded');
        expect(res.checks[2].state).toBe('degraded');
        expect(res.checks[2].data.reason).toBe('Failure');
    });

    it('should throw error when failure status is invalid', async () => {
        expect(() => healthChecker.addCheck(async () => {
            return;
        }, 'always-invalid', 'invalid-status', ['default'])).toThrow();
    });

    it('should filter checkers with tags', async () => {
        healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy', 'unhealthy', ['default', 'normal']);
        healthChecker.addCheck(async () => {
            throw Error('Failure');
        }, 'always-unhealthy', 'unhealthy', ['default', 'abnormal']);

        let res;
        res = await healthChecker.getStatus('normal');
        expect(res.status).toBe('healthy');

        res = await healthChecker.getStatus('abnormal');
        expect(res.status).toBe('unhealthy');
    });

    it('should throw error when tags is empty', async () => {
        expect(() => healthChecker.addCheck(async () => {
            return;
        }, 'always-healthy', 'unhealthy', [])).toThrow();
    });
});
