function checkNegative(num) {
    return new Promise((resolve, reject) => {
        if (num < 0) return reject(`don't send nagative again!!!`)
        const squared = Math.sqrt(num);
        resolve({num, squared});
    })
}

checkNegative(-2)
    .then(({num, squared}) => { console.log(`the square root of ${num} is ${squared}`) })
    .catch((message) => { console.log(message) })

checkNegative(2)
    .then(({num, squared}) => { console.log(`the square root of ${num} is ${squared}`) })
    .catch((message) => { console.log(message) })