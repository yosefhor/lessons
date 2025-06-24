function parseJSON(str) {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(str));
    } catch (err) {
      reject(err);
    }
  });
}

parseJSON('{"name": "Alice"}')
  .then(data => console.log(data.name))
  .catch(error => console.log('Error:', error));

// Promise isn't necessary at all