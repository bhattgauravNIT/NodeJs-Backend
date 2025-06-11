Js is by default synchronous in nature, this means code execution happens line by line, now problem with line by line
execution is that its blocking, in case it comes across a code which needs time to execute, then it gets blocked at
that line and until this line of code gets completed it don't move to the next line.

Now when js is used as a server side language this behavior of js can make it very very slow.
Therefore in order to over come this the Node js architecture is designed in such a way that it can handle both blocking/synchronous
request and non-blocking/asynchronous request.

Js arch has call stack , a event queue and a event loop along a thread pool which makes this happen.

Js runs on a main thread lets call it js thread. Now there can be two types of request which can come in an asynchronous (non blocking) or synchronous (blocking). 

Lets understand this with help of example:

Say we are writing to a file

import fs from 'fs';

fs.writeFileSync('temp.txt', "{name: 'Gaurav', mobileNumber: '987xxxx'}");

Now we can read from this file in two ways:

a) Asynchronous or non blocking code:

console.log(1);
fs.readFile('temp.txt', (err, data) => {
     console.log(data.toString());
 })
console.log(2);

o/p is: 
1
2
{name: 'Gaurav', mobileNumber: '987xxxx'}

Lets understand how this non blocking things gets executed.

Js main thread runs, pushes console.log(1) to call stack executes it and pops from call stack.
Now see an asynchronous call fs.readFile() pushes to call stack but this will need time to go and read data from file so, assigns it
to a thread in thread pool to do this job (via libuv) and the main thread does not gets blocked, main js thread moves to next line pushes console.log(2) in call stack executes it and pops out of queue, now the thread was working in background completes his job and pushes a call back to
event queue. Event loop sees that call stack is empty so pushes callback to call stack and console.log(data.toString()) gets executed.

The thread pool has limited threads like generally 4 but however it can be increased to max number of cores of the system only.

b) Synchronous or blocking code:

console.log(1);
console.log(fs.readFileSync('temp.txt', 'utf-8'));
console.log(2);

o/p is: 
1
{name: 'Gaurav', mobileNumber: '987xxxx'}
2

Js main thread runs, pushes console.log(1) to call stack executes it and pops from call stack.
Now sees a synchronous blocking operation, the main js thread starts processing temp.txt file thread halts further execution until reading is complete. The call stack is paused until file reading is done. Now once complete , fs.readFileSync is now removed from call stack, 
the execution again starts pushes console.log(2), executes it and pops from stack. No thread pool is involved.

Note: This behavior of NOde js makes it slow as if non blocking code comes it assigns to thread pool as by default 4 threads are there, and threads
can be increased but upto limit of cores of CPU thus still limited threads can cause an issue, If a blocking request comes, program is halted till
execution is finished.


Now lets see what happens when we use async and await. Async is by default non blocking but if we use await does the program waits for the
execution to be completed and then only executes next, ain't this makes async blocking ??

The answer is no. We use await inside a async function lets see

async function getData() {
  const data = await fetchData();  // pauses here inside getData()
  console.log("Fetched:", data);
}

getData();
console.log("This still runs without waiting for fetch!");

Now see how execution happens, the js main thread runs, defines async function getData only, no execution, see execution of getData so starts
execution, reaches const data = await fetchData(); its await so assign a thread pool to do the job, halts the function execution of getData 
only, however continues execution of the rest program, sees console.log("This still runs without waiting for fetch!"); executes it.
Now say const data = await fetchData(); gets resolved so logs it.

Thus using a await inside async halts the function execution only from that point and not the entire program.








