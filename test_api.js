const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/projects/1',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
