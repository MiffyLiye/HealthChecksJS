# Health Checks
[![Build Status](https://travis-ci.org/MiffyLiye/HealthChecksJS.svg?branch=master)](https://travis-ci.org/MiffyLiye/HealthChecksJS)
[![codecov](https://codecov.io/gh/MiffyLiye/HealthChecksJS/branch/master/graph/badge.svg)](https://codecov.io/gh/MiffyLiye/HealthChecksJS)

A generic health checker.

## Getting Started

Install it via npm:

```shell
npm install @miffyliye/health-checks
```

Include in your project:

```javascript
var { HealthChecker, HealthStatus } = require('@miffyliye/health-checks');
const healthChecker = new HealthChecker();
healthChecker.addCheck(async () => {
    if (Math.random() > 0.5) {
        throw new Error('RandomFailure');
    }
}, 'db', HealthStatus.Unhealthy.name, ['default', 'all']);
healthChecker.addCheck(async () => {
    if (Math.random() > 0.5) {
        throw new Error('RandonFailure');
    }
}, 'external-service', HealthStatus.Degraded.name, ['all']);

// By default, it will filter checks which includes 'default' tag
var res = await healthChecker.getStatus();
// res will be something like 
// {
//     "status": "unhealthy",
//     "checks": [
//         {
//             "name": "db",
//             "state": "unhealthy",
//             "data": {
//                 "reason": "RandomFailure"
//             }
//         }
//     ]
// }

// You can use other tag to filter the checks
var res = await healthChecker.getStatus('all');
// res will be something like 
// {
//     "status": "degraded",
//     "checks": [
//         {
//             "name": "db",
//             "state": "healthy",
//             "data": {
//                 "reason": ""
//             }
//         },
//         {
//             "name": "external-service",
//             "state": "degraded",
//             "data": {
//                 "reason": "RandonFailure"
//             }
//         }
//     ]
// }
```

## License

MIT
