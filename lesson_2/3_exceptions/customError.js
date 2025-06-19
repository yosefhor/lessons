class CustomError extends Error {
    constructor(message, forClient) {
        super(message)
        this.forClient = forClient
    }
}

async function strUpCase(str) {
    try {
        if (typeof str !== 'string') throw new CustomError('invalid input', true)
        const result = str.toUpperCase()
        console.error(result);
    } catch (err) {
        if (err.forClient) console.error(err.message);
    }
}

strUpCase('a')
strUpCase(1)