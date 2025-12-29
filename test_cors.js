const https = require('https');

const options = {
    hostname: 'hirestories-api-gateway.onrender.com',
    port: 443,
    path: '/auth/register',
    method: 'OPTIONS',
    headers: {
        'Origin': 'https://hirestories.vercel.app',
        'Access-Control-Request-Method': 'POST'
    }
};

console.log(`Testing CORS for: https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);

    if (res.statusCode === 200) {
        if (res.headers['access-control-allow-origin']) {
            console.log("PASS: CORS Preflight check passed.");
        } else {
            console.log("FAIL: HTTP 200 but missing Access-Control-Allow-Origin.");
        }
    } else {
        console.log(`FAIL: CORS Preflight check failed.`);
    }
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
