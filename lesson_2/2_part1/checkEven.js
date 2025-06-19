function checkEven(num) {
    return new Promise((resolve, reject) => {
        if (num % 2 === 0) resolve(num)
        else reject(num)
    })
}

checkEven(2)
    .then((num) => { console.log(`${num} is even`) })
    .catch((num) => { console.log(`${num} is odd`) })

checkEven(3)
    .then((num) => { console.log(`${num} is even`) })
    .catch((num) => { console.log(`${num} is odd`) })