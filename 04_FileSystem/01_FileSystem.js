import fs from 'fs';

fs.writeFileSync('temp.txt', "{name: 'Gaurav', mobileNumber: '987xxxx'}");

fs.writeFile


// console.log(1);
// fs.readFile('temp.txt', (err, data) => {
//     console.log(data.toString());
// })
// console.log(2);


console.log(1);
console.log(fs.readFileSync('temp.txt', 'utf-8'));

console.log(2);
