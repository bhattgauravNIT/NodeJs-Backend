Any application is not written within a single file and thus multiple modules are created for better code readability and understanding
as well as debugging with every module performing its own set of duties. For ex we have a module math.js which can be used
for all computational logic in our application.

Moreover we have used module type as es6 and not common js module which is latest syntax for node projects. It can be seen in package.json as

{
    "type": "module"
}


**Common js vs ES6 modules**

ES6 are used by modern node projects and the way we import and export modules that syntax changes.
Common js imports modules are synchronous in nature meaning once in common js we encounter a require statement like 

Common js:

const module1 = require('...path to module1') 
const module2 = require('...path to maths module2') 

the execution is halted at module1 require till the module is imported.
Then it goes to next require statement which is asking for module2.


ES6:

import module1 from '../path to module1'
import module2 from '../path to module2'


However in es6 this is asynchronous meaning it parallely keeps loading the module wherever it sees a import and the execution is not halted 
to import just the first module itself. There after once all module which were needed are imported the normal code execution is started for the
logic which needs these module. So the compiler sees import statement for module 1 starts importing it and build a module graph, now
goes to next lines sees import for module 2 even before import of module 1 is complete and parallely starts importing module 2 even and insert in module graph.

Now once all modules are imported then comes for rest logical code execution.

Thus es6 module are better for performance wise.


**Different exports & imports in es6 module**

A module can export its members or functions in 3 ways:

1) default export 
2) named exports
3) mixed default and named exports


a) In default export it acts as one primary export of the module so say my module has 3 functions func1,func2 and func3
we can export them as public members as 

export default {
    func1, func2, func3
}

now in import, this export can be named anything i,e import myNamedModule from '.../module path' amd can be accessed as
myNamedModule.func1, myNamedModule.func2, myNamedModule.func3.

This is one primary export using default keyword and there fore even if we don't export entire object and export individual functions like

export default func1(){}
export default func2(){}
export default func3(){}

with more than one default keyword

This will fail and throw error because a module can have one primary default export. So to sum up, default exports are primary i,e one export default per module and can be named anything while importing.


b) In named exports these can be multiple named exports in a module and has to be imported with {} curly brackets only, in the consuming module.

export func1(){}
export func2(){}
export func3(){}

or 

export {func1, func2}

So in import these has to be imported via a curly as import {func1,func2,func3} from '.../path to module' and can be renamed
like {func1 as fun1, func2 as fun2, func3 as fun3} from '.../path to module'. We are here doing nothing but destructing of export object.


c) mixed default and named exports

say 

export default func1(){};
export func2(){};

so it will be imported as 

import func1, {func2} from '...path to module'
or
import myNamedFunc1, {func2 as fun2} from '.../path to module'


So to summarize, any default export is primary export and default keyword can be used once, with default keyword the object exported
can be imported without curly brackets and with any name, while normal named exports has to be imported via curly brackets with same name and
can be renamed using 'as' key word in consuming module's import.


Note: if we import like say import math from './checks-in-current-directory', so ./ checks in current directory whereas if we 
do something like import fs from 'fs', so it checks this in its node default installed packages or external installed packages.