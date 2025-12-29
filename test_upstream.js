const https = require('https');

function testUrl(label, url) {
    console.log(`\n--- Testing ${label} ---`);
    console.log(`URL: ${url}`);
    const req = https.get(url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Body: ${data.substring(0, 500)}`); // Print first 500 chars
        });
    });
    req.on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}

// 1. Direct hit to Auth Service on a known valid endpoint (assuming /auth/validate exists and takes GET, or just check 404 on root)
testUrl('Auth Service Direct (Root)', 'https://hirestories-auth-service.onrender.com/');

// 2. Gateway hit forwarding to Auth
testUrl('Gateway -> Auth (Validate)', 'https://hirestories-api-gateway.onrender.com/auth/validate?token=invalid_test_token');
