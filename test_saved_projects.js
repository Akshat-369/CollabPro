const http = require('http');

function login() {
  const registerData = JSON.stringify({
    name: 'SaveUser',
    email: 'saveuser' + Date.now() + '@test.com',
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
        console.log('Registered and got token');
        
        // 1. Create a project to save
        createProject(token, (projectId) => {
            // 2. Save the project
            saveProject(token, projectId, () => {
                // 3. Fetch saved projects to verify
                getSavedProjects(token, projectId);
            });
        });
      }
    });
  });
  req.write(registerData);
  req.end();
}

function createProject(token, callback) {
    const projectData = JSON.stringify({
        title: "Project to Save",
        location: "Remote",
        price: "200",
        experience: "Beginner",
        projectType: "Frontend",
        status: "Active",
        description: "Desc",
        longDescription: "Long Desc",
        tags: ["React"],
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
            const project = JSON.parse(data);
            console.log('Created Project ID:', project.id);
            callback(project.id);
        });
    });
    req.write(projectData);
    req.end();
}

function saveProject(token, projectId, callback) {
    const options = {
        hostname: 'localhost',
        port: 8080,
        path: `/api/projects/${projectId}/save`,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    const req = http.request(options, res => {
        console.log('Save Project Status:', res.statusCode);
        callback();
    });
    req.end();
}

function getSavedProjects(token, expectedId) {
    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/projects/saved',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Get Saved Projects Status:', res.statusCode);
            try {
                const projects = JSON.parse(data);
                console.log('Number of saved projects:', projects.length);
                if (projects.length > 0) {
                    console.log('Saved project ID:', projects[0].id);
                    console.log('Is Expected ID?', projects[0].id == expectedId);
                }
            } catch (e) {
                console.log('Error parsing response:', data);
            }
        });
    });
    req.end();
}

login();
