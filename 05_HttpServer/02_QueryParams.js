import http from 'http';
import fs from 'fs';
import url from 'url';

const myServer = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') return res.end();
    let date = new Date();
    fs.appendFile('serverLogs.Txt', `${date.getTime()} -> Received request from ${req.url}\n`, (err, res) => {
        if (err) {
            console.log(`Oops something went wrong! Unable to write to Server logs`);
        }
    });
    const param = url.parse(req.url, true);
    handleRequest(param, res);
})

function handleRequest(param, res) {
    switch (param.pathname) {
        case "/home":
            res.end(`Welcome to Home`);
            break;
        case "/about":
            const userName = param.query.name;
            res.end(`Hi ${userName}, great to have you here !`);
            break;
        case "/search":
            const search = param.query.search;
            res.end(`Showing the results for ${search}`);
            break;
        default:
            res.end("Not found");
    }
}

myServer.listen('8081', () => {
    console.log('Server listening at port 8081');
})