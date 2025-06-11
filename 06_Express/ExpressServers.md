So in order to over come the problem of native http module servers where the code was non manageable and also non scalable,
we use express framework.

Thus in order to create a server using express js we first need to install express using
npm i express and then simply:

```javascript
import express from 'express';

const app = express();

app.listen(8080, () => {
    console.log('App listening at 8080');
})

app.get('/', (req, res) => {
    res.send(`Welcome to home page`);
})

app.get('/about', (req, res) => {
    res.send(`Hello ${req.query.user}, your age is ${req.query.age}`);
})
```

**Versioning in Node js**

All the packages or modules which we need in our application are installed and their versions are provided in package.json.
Package lock.json provide the versions for the inter dependent modules, packages of these main module in package.json
which we have installed.

Now say we have installed express in our application so in the package.json we can see

"express": "^5.1.0",

Lets understand this Versioning:

in 5.1.0

5 resembles major change of version and thus updating this can be a possible ground breaking change.
1 resembles recommended bug fix within the version of 5
0 resembles minor bugFix or change within the version 5.

Now there are some symbols like:

^ -> carrot symbol. This means that we are saying if i upgrade my server then you can update all recommended and minor 
bugFix versions i,e you are allowed to change 1 and 0 however the main version i,e 5 should not be changed on updates.

So in case a 6 version is released somewhere in future and if i place an update command i,e ncu -u (to update package.json)
then my main version i,e 5 for express should never be updated, however only recommended and minor version changes are allowed.

~ -> squash symbol means that only minor change version update is allowed and not recommended and entire version change.
So suppose in package.json 

"express": "~5.1.0",

Means when i will update my package.json using ncu-u then only 0 value upgrades are allowed and not even recommended i,e 1
and entire version change i, 5 are not allowed.

