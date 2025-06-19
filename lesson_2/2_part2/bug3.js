function asyncDivide(a, b) {
    return new Promise((resolve, reject) => {
        if (b === 0) {
            return reject('Cannot divide by zero');//return
        }
        resolve(a / b);
    });
}

asyncDivide(10, 0)
    .then(result => console.log(result))
    .catch(error => console.log(error));
