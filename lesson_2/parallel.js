const url1 = 'https://jsonplaceholder.typicode.com/users/1'
const url2 = 'https://jsonplaceholder.typicode.com/posts?userId=1'

const fetch1 = async (url) => {
    const response = await fetch(url);
    const data = response.json()
    return data
}

const fetch2 = async (url) => {
    const response = await fetch(url);
    const data = response.json()
    return data
}

Promise.all([fetch1(url1), fetch2(url2)]).then((data) => console.log(data))