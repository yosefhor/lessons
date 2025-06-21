async function divide(a, b) {
    try {
        if (b === 0) throw new Error(`can't divide by 2`)
        const result = a / b;
        console.log(result);
    } catch (err) {
        console.error(err.message);
    }
}

divide(5,0)
divide(5,2)