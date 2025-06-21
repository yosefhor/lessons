function parseJSON(str) {
    return new Promise((resolve, reject) => {
        try {
            const result = JSON.parse(str);
            resolve(result)
        } catch (error) {
            reject(`error occoured: ${error}`)
        }
    })
}

async function getUserName(jsonStr) {
    try {
        const result = await parseJSON(jsonStr);
        if (typeof result === 'string') return (result)
    } catch (error) {
        return ('error occoured')
    }
}

getUserName("Matan").then(console.log).catch(console.log)

getUserName('"Matan"').then(console.log).catch(console.log)
