const getRandom = new Promise((resolve, reject) => {
    const random = Math.ceil(Math.random() * 10)
    resolve(random)
})

const multiplyByThree = (initNum) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(initNum * 3)
        }, 500);
    })
}

getRandom
    .then(multiplyByThree)
    .then((finalSum) => {
        console.log(finalSum);
    })