class ValidationError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}
async function checkStr(str) {
    try {
        if (typeof str !== 'string') throw new ValidationError(`${str} isn't accepted, send a valid string or you're dead!!!`, 403)
        console.log(str);
    } catch (err) {
        console.error(err.status, err.message);
    }
}

checkStr(5)
checkStr('5')