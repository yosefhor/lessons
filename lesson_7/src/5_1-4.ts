//1
const greet = (name: string): void => {
    console.log(`hello ${name}!`);
}
greet('Dan')

//2
const checkLength = (names: string[]): void => {
    const namesLength = names.map(name => name.length)
    console.log(namesLength);
}
checkLength(['Dan', 'Sam', 'Ben', 'Abraham'])

//3
const introduce = (name: string, age?: number): void => {
    console.log(`Hello, my name us ${name}${age ? ` and I'm ${age} years old!` : ''}`);
}
introduce('Natan')
introduce('Abraham', 30)

//4
interface User {
    name: string;
    age: number;
    isAdmin: boolean;
}
const createUser = (name: string, age: number, isAdmin: boolean): User => {
    return ({
        name,
        age,
        isAdmin
    })
}
createUser('Jacob', 45, true)
