const http = require('http');

function login() {
  const registerData = JSON.stringify({
    name: 'DebugUser',
    email: 'debug' + Date.now() + '@test.com',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerData)
    }
  };

  const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        const token = JSON.parse(data).token;
        createProject(token);
      }
    });
  });
  req.write(registerData);
  req.end();
}

function createProject(token) {
    const projectData = JSON.stringify({
        title: "Test Project JSON Field",
        location: "Remote",
        price: "100",
        experience: "Expert",
        projectType: "Backend",
        status: "Active",
        description: "Short desc",
        longDescription: "<p>This is the long description</p>",
        tags: ["Java"],
        requirements: ["Code"]
    });

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/projects',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Length': Buffer.byteLength(projectData)
        }
    };

    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('Keys:', Object.keys(json));
                console.log('longDescription:', json.longDescription);
                console.log('aboutProject:', json.aboutProject);
            } catch (e) {
                console.log(data);
            }
        });
    });
    req.write(projectData);
    req.end();
}

login();
