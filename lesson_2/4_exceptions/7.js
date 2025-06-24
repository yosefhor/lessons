const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err)
    console.log('File error:' + err.message)
  else
    console.log(data.toUpperCase());//Case
});

