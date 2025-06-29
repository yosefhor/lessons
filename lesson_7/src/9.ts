//1
function swap<T>(arr: [T, T]): [T, T] { return [arr[1], arr[0]] }
console.log(swap([1, 2]));
console.log(swap(['1', '2']));

//2
function lastElement<T>(arr: T[]): T | undefined { return arr.at(-1) }
console.log(lastElement([1, 2, 3]));
console.log(lastElement([]));

//3
class Stack<T> {
    private arr: T[] = [];
    push(newPart: T): void {
        this.arr.push(newPart)
    }
    pop(): T | undefined {
        return this.arr.pop()
    }
}
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log(stack.pop());

//4
function mergeObjects<T extends object, U extends object>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 }
}
const obj1 = { name: "Alice" };
const obj2 = { age: 25 };
console.log(mergeObjects(obj1, obj2)); // { name: "Alice", age: 25 }

//5
abstract class Entity {
    constructor(protected id: number) { }
    abstract getDetails(): string
}
class User extends Entity {
    constructor( id: number,public name: string) {
        super(id);
    }
    getDetails(): string {
        return `User: ${this.name}, ID: ${this.id}`
    }
}
class Product extends Entity {
    constructor( id: number,public price: number) {
        super(id);
    }
    getDetails(): string {
        return `Product price: ${this.price}, ID: ${this.id}`
    }
}
function processEntity<T extends Entity>(inst: T): string {
    return inst.getDetails()
}
const user = new User(1, "Alice");
const product = new Product(2, 99.99);
console.log(processEntity(user));    // "User: Alice, ID: 1" (למשל)
console.log(processEntity(product)); // "Product price: 99.99, ID: 2" (למשל)
