/**Default export */

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

export default {
    add, subtract
}


/** Named export */

export function func1() { }
export function func2() { }

function func3() { }
function func4() { }

export { func3, func4 }



/**
 * mixed default and named exports
 */

// export default function func5(){};
// export function func6(){};