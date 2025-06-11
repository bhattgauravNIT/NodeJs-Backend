import http from 'http';
import fs from 'fs';


const myServer = http.createServer((req, res) => {
    let date = new Date();
    fs.appendFile('serverLogs.Txt', `${date.getTime()} -> Received request from ${req.url}\n`, (err,res)=>{
        if(err){
            console.log(`Oops something went wrong! Unable to write to Server logs`);
        }
    });
    res.end(`Hello welcome to ${req.url}`);
})

myServer.listen('8080', () => {
    console.log('Server listening at port 8080');
})