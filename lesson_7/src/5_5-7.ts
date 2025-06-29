//5
interface User {
    name: string;
    age: number;
    email?: string;
}
const printUser = (user: User): void => {
    console.log(`Name: ${user.name}, Age: ${user.age}, Email: ${user.email || 'Not Provided'}`);
}
const userWithoutEmail: User = { name: "Haim", age: 30 };
const userWithEmail: User = { name: "Yoel", age: 15, email: 'yoel@gmail.com' };
printUser(userWithoutEmail)
printUser(userWithEmail)

//6
interface Product {
    id: number;
    name: string;
    price: number;
    category: string
}
function getProductInfo(product: Product): string {
    return (`Product: ${product.name}, Category: ${product.category}, Price: ${product.price}`)
}
const product: Product = { id: 1, name: "Laptop", price: 5000, category: "Electronics" };
console.log(getProductInfo(product));

//7
interface Task {
    id: number;
    title: string;
    completed: boolean
}
function getCompletedTasks(tasks: Task[]): string[] {
    return tasks.filter(task => task.completed).map(task => task.title)
}
const tasks: Task[] = [
    { id: 1, title: "Do Homework", completed: true },
    { id: 2, title: "Wash Dishes", completed: false },
    { id: 3, title: "Buy Groceries", completed: true },
];
console.log(getCompletedTasks(tasks));

