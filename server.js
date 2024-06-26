const http = require('http');
const { parse } = require('url');
const { inputFileFunc, outputFileFunc } = require('./users.js');


const handleGetRequest = async (req, res) => {
    const { pathname } = parse(req.url);

    if (pathname === '/api/users') {
        try {
            const data = await outputFileFunc();
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            });
            res.end(JSON.stringify(data));
        } catch (err) {
            console.error('Error:', err);
            res.writeHead(500, {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"
            });
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.end('Not Found');
    }
};

const handlePostRequest = (req, res) => {
    const { pathname } = parse(req.url);

    if (pathname === '/api/users') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const fileContent = await outputFileFunc();
                const data = JSON.parse(body);

                fileContent.push(data);

                await inputFileFunc(fileContent);

                res.writeHead(200, {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                });
                res.end(JSON.stringify({ message: 'Form data received', data }));
            } catch (err) {
                console.error('Error:', err);
                res.writeHead(500, {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                });
                res.end('Internal Server Error');
            }
        });
    } else {
        res.writeHead(404, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.end('Not Found');
    }
};

const server = http.createServer((req, res) => {
    const { method } = req;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    switch (method) {
        case 'GET':
            return handleGetRequest(req, res);
        case 'POST':
            return handlePostRequest(req, res);
        default:
            res.writeHead(405, {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*"
            });
            res.end('Method Not Allowed');
    }
});

server.listen(4000, () => {
    console.log('Server is listening on port 4000');
});
