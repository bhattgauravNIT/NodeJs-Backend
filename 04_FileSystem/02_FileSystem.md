File system or FS is a in built package in Node which allows us to interact or create files within the system.

import fs from 'fs';

It offers both synchronous and asynchronous operations on read , write etc.

Some example are:

**ASynchronous/Non Blocking**

fs.readFile('temp.txt', (err, data) => {
     console.log(data.toString());
})

fs.writeFile('example.txt', 'Hello, world!', 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully!');
});

Node.js v10+, provides a modern, Promise-based API. Perfect for async/await and provides a clearer syntax as compared to
callbacks for ASynchronous calls

await fs.promise.readFile(temp.txt', 'utf-8')


**Synchronous/Blocking**

fs.readFileSync('temp.txt', 'utf-8')

fs.writeFileSync('temp.txt', "{name: 'Gaurav', mobileNumber: '987xxxx'}")

Thus its generally better to use a asynchronous or non blocking code or file system method as the server will be able
to handle other request as well and wont slow down the server.

Now in case all my threads of thread pools gets utilized is there a bootle, not much as the task will then be queued and once
a thread is free that task will be taken up, however with synchronous code the main js thread will get blocked. In case of 
asynchronous operations the server will still be responsive without crash. 

Sometimes for writing very large file we can use streaming APIs  like fs.createReadStream();




