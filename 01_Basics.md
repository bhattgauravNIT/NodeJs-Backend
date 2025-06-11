Node js is a run time env for execution of java script. Previously java script was simply a client side language only because
java script could be compiled via java script engine which were present in browsers like chrome uses v8 engine, where as
fire fox uses spider monkey. So what happened is these guys took out this v9 engine from chrome and integrated it with some c++
due to this node js was born. Thus node js is simply a run time for execution of js and its not a framework or a library.

Now node js is capable of compiling js files but say if we write our file in ts will it be able to compile. The answer is no.
However there is a hack, we can convert a ts file into a js file using $ tsc fileName, after this a js file will get generated and now
we can run this js file using say $ node fileName.

Once we install node js, the npm which is node packet manager which is ideally responsible for handling various libraries or packages
in pur project will get installed.

The package.json is the main configuration file in our node js project. Its responsible for handling the scripts, managing package version,
dev dependencies, test scripts etc. It can be generated via npm using npm init command.

In node js there are certain js functions which are not available, like in node js we can't access window object or alert but however
these same are available in browser. The main reason behind it is while embedding the v8 engine with c++ since the need was to create a server
side env and thus all dom related functionalities or features were being removed and new features like file handling, hashing, crypting etc
were being introduced.

In in this project we have a package.json which is the main configuration file. Main.js file acts as an entry points in our application
and in package.json we have a script property like 

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node main.js"
},

so npm run start will trigger the command node main.js and thus applications entry point will be invoked.