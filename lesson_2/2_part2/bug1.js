const fs = require('fs/promises');

function printFile(filename) {
  fs.readFile(filename, 'utf8')
    .then(data => console.log(data.toUpperCase()))//"C"
    .catch(()=>{console.log('An error occurred')});//wrap log with fn
}

printFile('example.txt');