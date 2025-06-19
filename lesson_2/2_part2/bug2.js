const fetch = require('node-fetch');// install package

fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())//add ()
    .then(data => {
        console.log("Title:", data.title)
    })
    .catch(err => {
        console.log('Error:', err)
    });
